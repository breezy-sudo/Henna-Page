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

// ── Gallery Data ───────────────────────────────────────────────
// To add a new design to an existing category: add a filename to that
// category's `images` array.
// To add a whole new category: add a new object to this array with a
// unique `id`, a `label`, and an `images` array (first image is the cover).
const galleryData = [
  {
    id: 'bridal-full-set',
    label: 'Bridal Full Set',
    images: [
      'WhatsApp Image 2026-05-30 at 23.48.35.jpeg'
    ]
  },
  {
    id: 'hand-mandala',
    label: 'Hand Mandala',
    images: [
      'WhatsApp Image 2026-05-30 at 23.48.31.jpeg'
    ]
  },
  {
    id: 'black-henna',
    label: 'Black Henna',
    images: [
      'WhatsApp Image 2026-05-30 at 23.48.34.jpeg'
    ]
  },
  {
    id: 'bridal-feet',
    label: 'Bridal Feet Design',
    images: [
      'WhatsApp Image 2026-05-30 at 23.48.36.jpeg'
    ]
  },
  {
    id: 'palm-florals',
    label: 'Palm Florals',
    images: [
      'WhatsApp Image 2026-05-31 at 12.40.38.jpeg'
    ]
  },
  {
    id: 'mix-design',
    label: 'Mix Design',
    images: [
      'WhatsApp Image 2026-05-30 at 23.48.33.jpeg'
    ]
  },
  {
    id: 'tattoo-inspired',
    label: 'Tattoo-Inspired',
    images: [
      'WhatsApp Image 2026-05-30 at 23.48.32.jpeg'
    ]
  }
];

let expandedGalleryId = null;

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = '';

  galleryData.forEach(category => {
    const tile = document.createElement('div');
    tile.className = 'gallery-item' + (category.id === expandedGalleryId ? ' active' : '');
    tile.style.backgroundImage = `url("${category.images[0]}")`;
    tile.style.backgroundSize = 'cover';
    tile.style.backgroundPosition = 'center';

    const countTag = category.images.length > 1 ? ` (${category.images.length})` : '';
    tile.innerHTML = `<div class="gallery-label">${category.label}${countTag}</div>`;

    tile.addEventListener('click', () => {
      expandedGalleryId = (expandedGalleryId === category.id) ? null : category.id;
      renderGallery();
    });

    grid.appendChild(tile);

    if (category.id === expandedGalleryId) {
      const expandRow = document.createElement('div');
      expandRow.className = 'gallery-expand-row';
      category.images.forEach(imgSrc => {
        const sub = document.createElement('div');
        sub.className = 'gallery-sub-item';
        sub.style.backgroundImage = `url("${imgSrc}")`;
        expandRow.appendChild(sub);
      });
      grid.appendChild(expandRow);
    }
  });
}

renderGallery();

// ── Pricing Engine (Henna Type × Body Area, dummy prices for now) ──
// Mirrors the structure of the backend's config/pricing.js exactly —
// swap the numbers here AND there once real prices are decided.
const PRICE_TABLE = {
  local: { hands: 3000, feet: 3000, hands_feet: 5000, palms: 2000, shoulder_collarbone: 4000 },
  black: { hands: 4000, feet: 4000, hands_feet: 7000, palms: 2500, shoulder_collarbone: 5000 },
  mix: { hands: 4500, feet: 4500, hands_feet: 8000, palms: 3000, shoulder_collarbone: 5500 }
};
const BRIDAL_PRICE = 20000;
const HOME_SERVICE_BANDS = {
  within_5km: 1000,
  '5_15km': 2500,
  over_15km: 5000
};

const AREA_LABELS = {
  hands: 'Hands Only',
  feet: 'Feet Only',
  hands_feet: 'Hands & Feet',
  palms: 'Palms Only',
  shoulder_collarbone: 'Shoulder & Collarbone'
};
const HENNA_LABELS = { local: 'Local Henna', black: 'Black Henna', mix: 'Mix / Custom' };

function formatNaira(n) {
  return '₦' + n.toLocaleString('en-NG');
}

// Fill in each price on page load so customers see it before adding anything
Object.keys(PRICE_TABLE).forEach(hennaType => {
  Object.keys(PRICE_TABLE[hennaType]).forEach(area => {
    const el = document.getElementById(`price-${hennaType}-${area}`);
    if (el) el.textContent = formatNaira(PRICE_TABLE[hennaType][area]);
  });
});
const bridalLabelEl = document.getElementById('bridalPriceLabel');
if (bridalLabelEl) bridalLabelEl.textContent = `Complete package — ${formatNaira(BRIDAL_PRICE)}`;

// selectedPairs: Set of "hennaType_bodyArea" strings, e.g. "black_hands"
let selectedPairs = new Set();
let bridalSelected = false;

function toggleAccordion(hennaType) {
  const body = document.getElementById(`body-${hennaType}`);
  const header = body.previousElementSibling;
  body.classList.toggle('open');
  header.classList.toggle('open');
}

function togglePair(hennaType, bodyArea) {
  const key = `${hennaType}_${bodyArea}`;
  const row = document.querySelector(`.pair-row[data-henna="${hennaType}"][data-area="${bodyArea}"]`);
  const btn = row.querySelector('.pair-toggle');

  if (selectedPairs.has(key)) {
    selectedPairs.delete(key);
    row.classList.remove('added');
    btn.classList.remove('added');
    btn.textContent = '+';
  } else {
    selectedPairs.add(key);
    row.classList.add('added');
    btn.classList.add('added');
    btn.textContent = '−';
  }

  updateAccordionBadge(hennaType);
  recalculateTotal();
}

function updateAccordionBadge(hennaType) {
  const count = Array.from(selectedPairs).filter(k => k.startsWith(hennaType + '_')).length;
  const badge = document.getElementById(`badge-${hennaType}`);
  const accordion = document.getElementById(`accordion-${hennaType}`);
  badge.textContent = count > 0 ? `${count} added` : '';
  accordion.classList.toggle('has-selection', count > 0);
}

function toggleBridal(checkbox) {
  bridalSelected = checkbox.checked;
  recalculateTotal();
}

function recalculateTotal() {
  const list = document.getElementById('priceSummaryList');
  const totalEl = document.getElementById('priceSummaryTotal');
  let total = 0;
  let lines = [];

  selectedPairs.forEach(key => {
    const underscoreIndex = key.indexOf('_');
    const hennaType = key.slice(0, underscoreIndex);
    const bodyArea = key.slice(underscoreIndex + 1);
    const price = (PRICE_TABLE[hennaType] && PRICE_TABLE[hennaType][bodyArea]) || 0;
    total += price;
    lines.push(`<div class="price-summary__line"><span>${HENNA_LABELS[hennaType]} — ${AREA_LABELS[bodyArea]}</span><span>${formatNaira(price)}</span></div>`);
  });

  if (bridalSelected) {
    total += BRIDAL_PRICE;
    lines.push(`<div class="price-summary__line"><span>Bridal Henna (package)</span><span>${formatNaira(BRIDAL_PRICE)}</span></div>`);
  }

  const locationChecked = document.querySelector('input[name="location"]:checked')?.value;
  const distanceBandEl = document.getElementById('distanceBand');
  if (locationChecked === 'home' && distanceBandEl && distanceBandEl.value) {
    const fee = HOME_SERVICE_BANDS[distanceBandEl.value] || 0;
    total += fee;
    lines.push(`<div class="price-summary__line"><span>Home Service (${distanceBandEl.options[distanceBandEl.selectedIndex].text})</span><span>${formatNaira(fee)}</span></div>`);
  }

  list.innerHTML = lines.length
    ? lines.join('')
    : '<span class="price-summary__empty">Nothing added yet — tap a henna type above to begin.</span>';
  totalEl.textContent = formatNaira(total);
}


// ── Booking Form Submit ───────────────────────────────────────
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:7000'
  : 'https://meenahs-server-production.up.railway.app';

function submitBooking(e) {
  e.preventDefault();

  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;
  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const selections = Array.from(selectedPairs).map(key => {
    const underscoreIndex = key.indexOf('_');
    return {
      hennaType: key.slice(0, underscoreIndex),
      bodyArea: key.slice(underscoreIndex + 1)
    };
  });
  const location = document.querySelector('input[name="location"]:checked')?.value;
  const homeAddress = document.getElementById('homeAddress')?.value.trim() || "";
  const distanceBand = location === 'home' ? (document.getElementById('distanceBand')?.value || "") : "";
  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  const notes = document.getElementById('clientNotes').value.trim();


  if (!date || !time || !name || !phone || !location || !payment) {
    showToast('Please complete all required fields before submitting.', 'error');
    return;
  }

  if (selections.length === 0 && !bridalSelected) {
    showToast('Please choose at least one henna type and area, or Bridal Henna.', 'error');
    return;
  }

  if (location === 'home' && !distanceBand) {
    showToast('Please select how far you are from the studio.', 'error');
    return;
  }

  // creating boooking object
  const bookingData = {
    name: name,
    phone: phone,
    date: date,
    time: time,
    selections: selections,
    bridalSelected: bridalSelected,
    location: location,
    homeAddress: homeAddress,
    distanceBand: distanceBand,
    payment: payment,
    notes: notes
  };

  showToast('Saving your booking....🌸', 'success');

  // Sendin to express server
  fetch(`${API_BASE}/bookings`, {
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


  // reset accordion / pricing state
  selectedPairs.clear();
  bridalSelected = false;
  document.querySelectorAll('.pair-row').forEach(row => row.classList.remove('added'));
  document.querySelectorAll('.pair-toggle').forEach(btn => { btn.classList.remove('added'); btn.textContent = '+'; });
  document.querySelectorAll('.henna-accordion').forEach(acc => acc.classList.remove('has-selection'));
  document.querySelectorAll('.henna-accordion__badge').forEach(b => b.textContent = '');
  document.querySelectorAll('.henna-accordion__body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.henna-accordion__header').forEach(h => h.classList.remove('open'));
  recalculateTotal();



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
