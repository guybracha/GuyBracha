document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('myModal');
  const modalBox = modal.querySelector('.modal-box');
  const modalImg = document.getElementById('img01');
  const caption = document.getElementById('caption');

  // תומך גם אם נשאר .close ישן
  const closeBtn = modal.querySelector('.btn-close-modal') || modal.querySelector('.close');

  // כל התמונות בדף
  const allImgs = Array.from(document.querySelectorAll('.design-img'));

  // בניית קבוצות לפי data-group (או all)
  const groups = allImgs.reduce((acc, img) => {
    const group = img.dataset.group || 'all';
    acc[group] = acc[group] || [];
    acc[group].push(img);
    return acc;
  }, {});

  let lastFocused = null;
  let currentGroup = 'all';
  let currentIndex = -1;

  function preload(src) {
    if (!src) return;
    const img = new Image();
    img.src = src;
  }

  function setModalImage(imgEl) {
    const fullSrc = imgEl.getAttribute('data-full') || imgEl.src;
    const alt = imgEl.getAttribute('alt') || '';
    modalImg.src = fullSrc;
    modalImg.alt = alt;
    caption.textContent = alt;
  }

  function openModalByIndex(group, index) {
    currentGroup = group;
    currentIndex = index;

    const imgs = groups[currentGroup];
    const imgEl = imgs[currentIndex];
    if (!imgEl) return;

    lastFocused = document.activeElement;
    setModalImage(imgEl);

    // preload שכנים
    const prev = imgs[(currentIndex - 1 + imgs.length) % imgs.length];
    const next = imgs[(currentIndex + 1) % imgs.length];
    preload(prev?.dataset.full || prev?.src);
    preload(next?.dataset.full || next?.src);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // עדיף פוקוס על ה-X לנגישות
    setTimeout(() => (closeBtn ? closeBtn.focus() : modal.focus()), 0);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    caption.textContent = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function showNext(dir = 1) {
    const imgs = groups[currentGroup] || [];
    if (!imgs.length) return;
    currentIndex = (currentIndex + dir + imgs.length) % imgs.length;
    setModalImage(imgs[currentIndex]);

    // preload לשכן הבא
    const neighbor = imgs[(currentIndex + dir + imgs.length) % imgs.length];
    preload(neighbor?.dataset.full || neighbor?.src);
  }

  // פתיחה מכל תמונה (גם עם data-full וגם עם data-group)
  document.body.addEventListener('click', (e) => {
    const img = e.target.closest('.design-img');
    if (!img) return;
    const group = img.dataset.group || 'all';
    const index = (groups[group] || []).indexOf(img);
    openModalByIndex(group, index);
  });

  // סגירה בכפתור X
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // סגירה בלחיצה על הרקע
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-box')) closeModal();
  });

  // ניווט בלחיצה: צד שמאל = previous, צד ימין = next
  modalBox.addEventListener('click', (e) => {
    // אם לחצו על הכפתור – אל תנווט
    if (e.target === closeBtn) return;
    const rect = modalBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) showNext(-1);
    else showNext(1);
  });

  // מקלדת: ESC לסגירה, חצים לניווט
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showNext(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showNext(-1);
    }
  });

  // מלכודת TAB בסיסית (closeBtn ←→ modalBox)
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = [closeBtn, modalBox].filter(Boolean);
    const idx = focusables.indexOf(document.activeElement);
    let next = 0;

    if (e.shiftKey) next = (idx <= 0) ? focusables.length - 1 : idx - 1;
    else next = (idx === focusables.length - 1) ? 0 : idx + 1;

    e.preventDefault();
    focusables[next].focus();
  });

  /* תמיכה בסיסית בסווייפ (מובייל) */
  let touchX = null;
  modalBox.addEventListener('touchstart', (e) => {
    touchX = e.touches?.[0]?.clientX ?? null;
  }, { passive: true });

  modalBox.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchX;
    const delta = endX - touchX;
    // סף מינימלי
    if (Math.abs(delta) > 40) showNext(delta < 0 ? 1 : -1);
    touchX = null;
  });
});

// Shrink header on scroll (עדין ולא רוטט)
document.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const y = window.scrollY || document.documentElement.scrollTop;
  header.classList.toggle('shrink', y > 40);
}, { passive: true });

// Smooth header shrink on scroll with hysteresis + rAF
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  let isShrunk = false;
  const ENTER_AT = 64;
  const EXIT_AT  = 24;

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const shouldShrink = isShrunk ? (y > EXIT_AT) : (y > ENTER_AT);
    if (shouldShrink !== isShrunk) {
      isShrunk = shouldShrink;
      header.classList.toggle('shrink', isShrunk);
    }
    ticking = false;
  }
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  onScroll();
})();
