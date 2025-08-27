// ==================== Gallery Modal with Zoom & Pan ====================
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('myModal');
  const modalBox = modal.querySelector('.modal-box');
  const modalImg = document.getElementById('img01');
  const caption = document.getElementById('caption');
  const closeBtn = modal.querySelector('.btn-close-modal') || modal.querySelector('.close');

  // Zoom toolbar
  const toolbar = modal.querySelector('.zoom-toolbar');
  const btnIn  = toolbar?.querySelector('.zoom-in');
  const btnOut = toolbar?.querySelector('.zoom-out');
  const btnReset = toolbar?.querySelector('.zoom-reset');

  // All thumbs
  const allImgs = Array.from(document.querySelectorAll('.design-img'));

  // Build groups by data-group
  const groups = allImgs.reduce((acc, img) => {
    const group = img.dataset.group || 'all';
    (acc[group] ||= []).push(img);
    return acc;
  }, {});

  let lastFocused = null;
  let currentGroup = 'all';
  let currentIndex = -1;

  // ---------- Zoom/Pan state ----------
  let scale = 1, minScale = 1, maxScale = 4;
  let tx = 0, ty = 0; // translate
  let isPanning = false;
  let startX = 0, startY = 0;
  let imgRectCache = null;

  function applyTransform() {
    modalImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    if (btnReset) btnReset.textContent = `${Math.round(scale * 100)}%`;
  }
  function resetTransform() {
    scale = 1; tx = 0; ty = 0;
    modalImg.style.transform = '';
    if (btnReset) btnReset.textContent = '100%';
  }
  function clampPan() {
    if (!imgRectCache) imgRectCache = modalImg.getBoundingClientRect();
    const vw = modalBox.clientWidth;
    const vh = modalBox.clientHeight;
    const imgW = modalImg.naturalWidth;
    const imgH = modalImg.naturalHeight;
    const displayedW = imgW * (imgRectCache.width / imgRectCache.width); // not used; keep for future
    // Compute max pan (approx) based on element box
    const boundsW = (modalImg.clientWidth * scale - vw) / 2;
    const boundsH = (modalImg.clientHeight * scale - (vh * 0.85)) / 2;
    if (boundsW > 0) { tx = Math.min(boundsW, Math.max(-boundsW, tx)); } else { tx = 0; }
    if (boundsH > 0) { ty = Math.min(boundsH, Math.max(-boundsH, ty)); } else { ty = 0; }
  }
  function zoomAt(clientX, clientY, deltaScale) {
    const rect = modalImg.getBoundingClientRect();
    const ox = clientX - (rect.left + rect.width / 2);
    const oy = clientY - (rect.top + rect.height / 2);

    const newScale = Math.min(maxScale, Math.max(minScale, scale * deltaScale));
    // Adjust translate so the point under cursor stays under cursor
    const k = newScale / scale;
    tx = (tx - ox) * k + ox;
    ty = (ty - oy) * k + oy;
    scale = newScale;
    clampPan();
    applyTransform();
  }

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
    resetTransform();
    imgRectCache = null;
  }

  function openModalByIndex(group, index) {
    currentGroup = group;
    currentIndex = index;
    const imgs = groups[currentGroup];
    const imgEl = imgs[currentIndex];
    if (!imgEl) return;

    lastFocused = document.activeElement;
    setModalImage(imgEl);

    // preload neighbors
    const prev = imgs[(currentIndex - 1 + imgs.length) % imgs.length];
    const next = imgs[(currentIndex + 1) % imgs.length];
    preload(prev?.dataset.full || prev?.src);
    preload(next?.dataset.full || next?.src);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
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
    const neighbor = imgs[(currentIndex + dir + imgs.length) % imgs.length];
    preload(neighbor?.dataset.full || neighbor?.src);
  }

  // ---------- Open from thumbnails ----------
  document.body.addEventListener('click', (e) => {
    const img = e.target.closest('.design-img');
    if (!img) return;
    const group = img.dataset.group || 'all';
    const index = (groups[group] || []).indexOf(img);
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
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    else if (e.key === 'ArrowRight' && scale === 1) { e.preventDefault(); showNext(1); }
    else if (e.key === 'ArrowLeft'  && scale === 1) { e.preventDefault(); showNext(-1); }
    else if ((e.key === '+' || e.key === '=') && toolbar) { e.preventDefault(); zoomAt(window.innerWidth/2, window.innerHeight/2, 1.2); }
    else if (e.key === '-' && toolbar) { e.preventDefault(); zoomAt(window.innerWidth/2, window.innerHeight/2, 1/1.2); }
    else if ((e.key === '0' || e.key === 'Escape') && toolbar && scale !== 1) { resetTransform(); }
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
});

// ==================== Sticky Header (no jitter) ====================
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
