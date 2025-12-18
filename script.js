// ==================== Gallery Modal with Zoom & Pan ====================
document.addEventListener('DOMContentLoaded', () => {
  const modal    = document.getElementById('myModal');
  const modalBox = modal?.querySelector('.modal-box');
  const modalImg = document.getElementById('img01');
  const caption  = document.getElementById('caption');
  const closeBtn = modal?.querySelector('.btn-close-modal') || modal?.querySelector('.close');

  if (!modal || !modalBox || !modalImg || !caption) return;

  // Make modal focusable for accessibility
  modal.setAttribute('tabindex', '-1');
  modalBox.setAttribute('tabindex', '0');

  // Zoom toolbar
  const toolbar  = modal.querySelector('.zoom-toolbar');
  const btnIn    = toolbar?.querySelector('.zoom-in');
  const btnOut   = toolbar?.querySelector('.zoom-out');
  const btnReset = toolbar?.querySelector('.zoom-reset');

  // All thumbs
  const allImgs = Array.from(document.querySelectorAll('.design-img'));

  // Build groups by data-group
  const groups = allImgs.reduce((acc, img) => {
    const group = img.dataset.group || 'all';
    (acc[group] ||= []).push(img);
    return acc;
  }, {});

  let lastFocused  = null;
  let currentGroup = 'all';
  let currentIndex = -1;

  // ---------- Zoom/Pan state ----------
  let scale = 1, minScale = 1, maxScale = 4;
  let tx = 0, ty = 0; // translate
  let isPanning = false;
  let startX = 0, startY = 0;
  let boxRectCache = null;

  function applyTransform() {
    modalImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    if (btnReset) btnReset.textContent = `${Math.round(scale * 100)}%`;
  }
  function resetTransform() {
    scale = 1; tx = 0; ty = 0;
    modalImg.style.transform = '';
    if (btnReset) btnReset.textContent = '100%';
  }

  // Compute safe pan bounds based on the visible box and scaled image box
  function clampPan() {
    // box (viewport of the modal)
    const boxRect = boxRectCache || modalBox.getBoundingClientRect();
    boxRectCache = boxRect;

    // image rendered size BEFORE transform
    const imgRect = modalImg.getBoundingClientRect();
    const renderedW = imgRect.width / scale; // undo current scale to get base
    const renderedH = imgRect.height / scale;

    const scaledW = renderedW * scale;
    const scaledH = renderedH * scale;

    // allow a small margin so edges can be reached
    const margin = 16;

    const maxX = Math.max(0, (scaledW - boxRect.width) / 2) + margin;
    const maxY = Math.max(0, (scaledH - boxRect.height) / 2) + margin;

    tx = Math.max(-maxX, Math.min(maxX, tx));
    ty = Math.max(-maxY, Math.min(maxY, ty));
  }

  function zoomAt(clientX, clientY, deltaScale) {
    const rect = modalImg.getBoundingClientRect();
    const ox = clientX - (rect.left + rect.width / 2);
    const oy = clientY - (rect.top  + rect.height / 2);

    const nextScale = Math.min(maxScale, Math.max(minScale, scale * deltaScale));
    const k = nextScale / scale;

    // keep pointer position under cursor
    tx = (tx - ox) * k + ox;
    ty = (ty - oy) * k + oy;

    scale = nextScale;
    clampPan();
    applyTransform();
  }

  function preload(src) {
    if (!src) return;
    const img = new Image();
    img.src = src;
  }

  function setModalImage(imgEl) {
    const fullSrc = imgEl.getAttribute('data-full') || imgEl.currentSrc || imgEl.src;
    const alt = imgEl.getAttribute('alt') || '';
    modalImg.src = fullSrc;
    modalImg.alt = alt;
    caption.textContent = alt;
    resetTransform();
    boxRectCache = null;
  }

  function openModalByIndex(group, index) {
    currentGroup = group;
    currentIndex = index;
    const imgs = groups[currentGroup] || [];
    const imgEl = imgs[currentIndex];
    if (!imgEl) return;

    lastFocused = document.activeElement;
    setModalImage(imgEl);

    // preload neighbors
    const prev = imgs[(currentIndex - 1 + imgs.length) % imgs.length];
    const next = imgs[(currentIndex + 1) % imgs.length];
    preload(prev?.dataset.full || prev?.currentSrc || prev?.src);
    preload(next?.dataset.full || next?.currentSrc || next?.src);

    // open (class 'is-open' so gsap-init.js יזהה)
    modal.classList.add('is-open');
    modal.style.display = 'flex'; // fallback even without GSAP
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // focus
    setTimeout(() => (closeBtn ? closeBtn.focus() : modalBox.focus()), 0);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    // If GSAP לא טען, נסגור ידנית אחרי קצר
    setTimeout(() => {
      if (!modal.classList.contains('is-open')) {
        modal.style.display = 'none';
        modalImg.src = '';
        caption.textContent = '';
      }
    }, 250);
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function showNext(dir = 1) {
    const imgs = groups[currentGroup] || [];
    if (!imgs.length) return;
    currentIndex = (currentIndex + dir + imgs.length) % imgs.length;
    setModalImage(imgs[currentIndex]);
    const neighbor = imgs[(currentIndex + dir + imgs.length) % imgs.length];
    preload(neighbor?.dataset.full || neighbor?.currentSrc || neighbor?.src);
  }

  // ---------- Open from thumbnails ----------
  document.body.addEventListener('click', (e) => {
    // Check if clicked element is an image or inside a graphics-card
    let img = e.target.closest('.design-img');
    
    // If not found, check if we clicked on the card itself
    if (!img) {
      const card = e.target.closest('.graphics-card');
      if (card) {
        img = card.querySelector('.design-img');
      }
    }
    
    if (!img) return;
    
    console.log('Image clicked:', img.src); // Debug
    const group = img.dataset.group || 'all';
    const index = (groups[group] || []).indexOf(img);
    console.log('Opening modal for group:', group, 'index:', index); // Debug
    openModalByIndex(group, index);
  });

  // Close
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close by backdrop
  modal.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-box')) closeModal();
  });

  // Navigate by click left/right ONLY when not zoomed
  modalBox.addEventListener('click', (e) => {
    if (e.target === closeBtn || e.target.closest('.zoom-toolbar')) return;
    if (scale > 1) return; // when zoomed, don't navigate
    const rect = modalBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) showNext(-1);
    else showNext(1);
  });

  // ---------- Keyboard ----------
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;

    // Close
    if (e.key === 'Escape') {
      e.preventDefault();
      if (scale !== 1) {
        resetTransform(); // ESC ראשון מאפס זום, ESC שני סוגר
        return;
      }
      closeModal();
      return;
    }

    // Navigate
    if (scale === 1) {
      if (e.key === 'ArrowRight') { e.preventDefault(); showNext(1); return; }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); showNext(-1); return; }
    }

    // Zoom (centered)
    if ((e.key === '+' || e.key === '=')) { e.preventDefault(); zoomAt(window.innerWidth/2, window.innerHeight/2, 1.2); }
    if (e.key === '-')                   { e.preventDefault(); zoomAt(window.innerWidth/2, window.innerHeight/2, 1/1.2); }
    if (e.key === '0')                   { e.preventDefault(); resetTransform(); }
  });

  // ---------- Wheel zoom ----------
  modalImg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.2 : 1/1.2;
    zoomAt(e.clientX, e.clientY, delta);
  }, { passive: false });

  // ---------- Double click to toggle 1x/2x ----------
  modalImg.addEventListener('dblclick', (e) => {
    e.preventDefault();
    const targetScale = (scale === 1) ? 2 : 1;
    const factor = targetScale / scale;
    zoomAt(e.clientX, e.clientY, factor);
  });

  // ---------- Pan with mouse when zoomed ----------
  modalImg.addEventListener('mousedown', (e) => {
    if (scale === 1) return;
    isPanning = true;
    startX = e.clientX - tx;
    startY = e.clientY - ty;
    modalImg.style.cursor = 'grabbing';
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    tx = e.clientX - startX;
    ty = e.clientY - startY;
    clampPan();
    applyTransform();
  });
  window.addEventListener('mouseup', () => {
    isPanning = false;
    modalImg.style.cursor = '';
  });

  // ---------- Touch: pinch to zoom + pan ----------
  let pinchStartDist = null;
  let pinchStartScale = 1;
  let pinchCenter = { x: 0, y: 0 };
  function distance(t1, t2){ const dx=t1.clientX-t2.clientX, dy=t1.clientY-t2.clientY; return Math.hypot(dx,dy); }
  function midpoint(t1, t2){ return { x:(t1.clientX+t2.clientX)/2, y:(t1.clientY+t2.clientY)/2 }; }

  modalImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      pinchStartDist = distance(e.touches[0], e.touches[1]);
      pinchStartScale = scale;
      pinchCenter = midpoint(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1 && scale > 1) {
      isPanning = true;
      startX = e.touches[0].clientX - tx;
      startY = e.touches[0].clientY - ty;
    }
  }, { passive: true });

  modalImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && pinchStartDist) {
      e.preventDefault();
      const d = distance(e.touches[0], e.touches[1]);
      const factor = d / pinchStartDist;
      const target = Math.min(maxScale, Math.max(minScale, pinchStartScale * factor));
      const delta = target / scale;
      zoomAt(pinchCenter.x, pinchCenter.y, delta);
    } else if (e.touches.length === 1 && isPanning) {
      e.preventDefault();
      tx = e.touches[0].clientX - startX;
      ty = e.touches[0].clientY - startY;
      clampPan();
      applyTransform();
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    pinchStartDist = null;
    isPanning = false;
  });

  // ---------- Focus trap (closeBtn <-> modalBox) ----------
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

  // ---------- Toolbar buttons ----------
  btnIn?.addEventListener('click', () => zoomAt(window.innerWidth/2, window.innerHeight/2, 1.2));
  btnOut?.addEventListener('click', () => zoomAt(window.innerWidth/2, window.innerHeight/2, 1/1.2));
  btnReset?.addEventListener('click', () => resetTransform());

  // ---------- Resize: reset cached rects ----------
  window.addEventListener('resize', () => {
    boxRectCache = null;
    // אם חל שינוי מהותי במידות – כדאי להגביל פאן קיים
    clampPan();
    applyTransform();
  }, { passive: true });
});

// ==================== Sticky Header (no jitter) ====================
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  let isShrunk = false;
  const ENTER_AT = 64;  // start shrinking after 64px
  const EXIT_AT  = 24;  // grow back under 24px

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

// ==================== Scroll to Top Button ====================
(() => {
  const scrollBtn = document.getElementById('scrollToTop');
  if (!scrollBtn) return;

  // Show/hide button based on scroll position
  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  scrollBtn.addEventListener('click', scrollToTop);
  
  // Initial check
  toggleScrollButton();
})();
