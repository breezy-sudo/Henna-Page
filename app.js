/* ============================================================
   MENAS HENNA ART — app.js
   ============================================================ */

// ── Page Navigation ──────────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    if (link.classList.contains('admin-nav')) return;
    e.preventDefault();
    const target = link.dataset.page;

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    link.classList.add('active');
    const page = document.getElementById('page-' + target);
    if (page) page.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ── Set min date to today ─────────────────────────────────────
const dateInput = document.getElementById('bookDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// ── Show address field for home service ──────────────────────
document.querySelectorAll('input[name="location"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const field = document.getElementById('homeAddressField');
    const studioField = document.getElementById('studioAddressField');
    const addressInput = document.getElementById('homeAddress');
    if (radio.value === 'home' && radio.checked) {
      field.classList.remove('hidden');
      studioField.classList.add('hidden');
      addressInput.setAttribute('required', '');
    } else if (radio.value !== 'home' && radio.checked) {
      studioField.classList.remove('hidden');
      field.classList.add('hidden');
      addressInput.removeAttribute('required');
    }
  });
});

// ── Booking Form Submit ───────────────────────────────────────
function submitBooking(e) {
  e.preventDefault();

  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;
  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const hennaType = document.querySelector('input[name="hennaType"]:checked')?.value;
  const bodyArea = document.querySelector('input[name="bodyArea"]:checked')?.value;
  const location = document.querySelector('input[name="location"]:checked')?.value;
  const homeAddress = document.getElementById('homeAddress')?.value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  const notes = document.getElementById('clientNotes')?.value.trim();


  if (!date || !time || !name || !phone || !hennaType || !bodyArea || !location || !payment) {
    showToast('Please complete all required fields before submitting.', 'error');
    return;
  }

  // creating boooking object
  const bookingData = {
    name: name,
    phone: phone,
    date: date,
    time: time,
    hennaType: hennaType,
    bodyArea: bodyArea,
    location: location,
    homeAddress: homeAddress,
    payment: payment,
    notes: notes
  };

  showToast('Saving your booking....🌸', 'success');

  // Sendin to express server
  fetch('http://localhost:7000/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Booking saved to mongoDB:', data);

      // Show success
      document.getElementById('bookingForm').classList.add('hidden');
      document.getElementById('successMsg').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Booking submitted! We\'ll be in touch shortly. 🌸', 'success');
    })
    .catch(error => {
      console.error('Error saving booking:', error);
      showToast('An error occurred while submitting your booking. Please try again.', 'error');
    })
};
// ── Reset form ────────────────────────────────────────────────
function resetForm() {
  document.getElementById('bookingForm').reset();
  document.getElementById('bookingForm').classList.remove('hidden');
  document.getElementById('successMsg').classList.add('hidden');
  document.getElementById('homeAddressField').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Contact Form Submit ───────────────────────────────────────
function submitContact(e) {
  e.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value.trim();

  // ══════════════════════════════════════════
  // REPLACE WITH YOUR WHATSAPP NUMBER
  const ADMIN_WHATSAPP = '2349037935182';
  // Example: '2348012345678'
  // ══════════════════════════════════════════

  const whatsappMessage = encodeURIComponent(
    `🌸 *New Message — Meenahs Henna Art*\n\n` +
    `*Name:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `*Subject:* ${subject}\n\n` +
    `*Message:*\n${message}\n\n` +
    `_Sent from the Meenahs Henna Art website_`
  );

  showToast('Opening WhatsApp... 🌸', 'success');

  setTimeout(() => {
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${whatsappMessage}`, '_blank');
    e.target.reset();
  }, 800);
}

// ── Toast Notification ────────────────────────────────────────
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(80px);
      padding: 0.85rem 1.8rem; border-radius: 30px;
      font-family: 'Jost', sans-serif; font-size: 0.85rem; letter-spacing: 0.05em;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2); z-index: 9999;
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
      opacity: 0; white-space: nowrap;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.background = type === 'success' ? '#5c2e0a' : '#b22222';
  toast.style.color = '#fdf6ee';

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity = '0';
  }, 3800);
}

// ── Subtle scroll reveal ──────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.form-card, .value-card, .gallery-item, .contact-info, .contact-form-wrap').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
