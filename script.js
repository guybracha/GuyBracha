document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('myModal');
  const modalBox = modal.querySelector('.modal-box');
  const modalImg = document.getElementById('img01');
  const caption = document.getElementById('caption');

  // תומך גם אם בטעות נשאר .close ישן
  const closeBtn = modal.querySelector('.btn-close-modal') || modal.querySelector('.close');

  let lastFocused = null;

  function openModal(src, alt) {
    lastFocused = document.activeElement;

    modalImg.src = src;
    modalImg.alt = alt || '';
    caption.textContent = alt || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // נעילת גלילה
    document.body.style.overflow = 'hidden';

    // לאפשר קליטת ESC (המודאל פוקוסבילי בזכות tabindex=-1)
    setTimeout(() => {
      // העדפה: פוקוס על כפתור סגירה לנגישות
      if (closeBtn) closeBtn.focus();
      else modal.focus();
    }, 0);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    caption.textContent = '';
    document.body.style.overflow = '';

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  // פתיחה מכל תמונה עם .design-img (תומך גם ב-data-full)
  document.body.addEventListener('click', (e) => {
    const img = e.target.closest('.design-img');
    if (!img) return;
    const fullSrc = img.getAttribute('data-full') || img.src;
    const alt = img.getAttribute('alt') || '';
    openModal(fullSrc, alt);
  });

  // סגירה בכפתור X
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // סגירה בלחיצה על הרקע (ולא כשנוגעים בקופסה)
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-box')) closeModal();
  });

  // ESC בכל מצב כשהמודאל פתוח
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      e.preventDefault();
      closeModal();
    }
  });

  // מלכודת TAB בסיסית (שלא יברח מהמודאל)
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = [closeBtn, modalBox].filter(Boolean);
    const idx = focusables.indexOf(document.activeElement);
    let next = 0;

    if (e.shiftKey) {
      next = (idx <= 0) ? focusables.length - 1 : idx - 1;
    } else {
      next = (idx === focusables.length - 1) ? 0 : idx + 1;
    }
    e.preventDefault();
    focusables[next].focus();
  });
});
