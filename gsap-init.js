/* ===== GSAP for Guy Bracha Portfolio ===== */
(() => {
  // הגנה ל־prefers-reduced-motion
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    // נאפס/נפשט אנימציות
    gsap.globalTimeline.timeScale(2);
  }

  /* -------- HERO (כותרת עליונה) -------- */
  const tlHero = gsap.timeline({ defaults: { ease: "power2.out" } });

  tlHero
    .set([".brand-title", ".brand-subtitle", ".btn-cta", ".header-avatar"], { opacity: 0, y: 20 })
    .to(".brand-title",   { opacity: 1, y: 0, duration: .7 }, 0.1)
    .to(".brand-subtitle",{ opacity: 1, y: 0, duration: .6 }, 0.25)
    .to(".btn-cta",       { opacity: 1, y: 0, duration: .6, stagger: .08 }, 0.4)
    .fromTo(".header-avatar",
            { opacity: 0, y: 12, rotate: -2, scale: .98 },
            { opacity: 1, y: 0, rotate: 0, scale: 1, duration: .7 }, 0.2);

  // הובר קטן ל־CTA
  document.querySelectorAll(".btn-cta").forEach(btn => {
    btn.addEventListener("pointerenter", () => gsap.to(btn, { y: -2, duration: .2 }));
    btn.addEventListener("pointerleave", () => gsap.to(btn, { y: 0,  duration: .25 }));
  });

  /* -------- Projects (Cards) -------- */
  // סטאגר על כל הכרטיסים כשנכנסים לתצוגה
  gsap.set(".row .card", { opacity: 0, y: 24 });
  ScrollTrigger.batch(".row .card", {
    start: "top 85%",
    once: true,
    onEnter: batch => {
      gsap.to(batch, {
        opacity: 1, y: 0, duration: .6, ease: "power2.out", stagger: .08
      });
    }
  });

  // אפקט "טילט" עדין בהובר (למחשב בלבד)
  const cards = document.querySelectorAll(".row .card");
  cards.forEach(card => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const ry = -((e.clientY - r.top) / r.height - 0.5) * 6;
      gsap.to(card, { rotationY: rx, rotationX: ry, transformPerspective: 800, transformOrigin: "center", duration: .25 });
    });
    card.addEventListener("pointerleave", () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: .35, ease: "power2.out" });
    });
  });

  /* -------- Graphic Designs (תמונות) -------- */
  // חשיפת תמונה: המסכה נסוגה + פייד־אין
  const revealImgs = gsap.utils.toArray(".design-img");
  revealImgs.forEach((img) => {
    // מצב התחלתי
    gsap.set(img, { opacity: 0, scale: 1.03 });
    // כשהתמונה נכנסת למסך
    const tl = gsap.timeline({
      scrollTrigger: { trigger: img, start: "top 85%", once: true }
    });
    tl.to(img, { opacity: 1, scale: 1, duration: .8, ease: "power2.out" }, 0)
      .to(img, {
        duration: 1,
        ease: "power3.inOut",
        onUpdate: function () {
          // נזיז את ה"מסכה" (ה-::after) ע"י עדכון inline-style — טריק פשוט
          img.style.setProperty("--maskScaleX", "0");
        },
        onStart: () => {
          // פריים ראשון: נשבור את הטריק לערך 1 -> 0
          img.style.setProperty("--maskScaleX", "1");
        },
        onComplete: () => {
          // ניקוי: נעלים את הכיסוי לחלוטין
          img.style.setProperty("--maskScaleX", "0");
          img.style.setProperty("overflow", "visible");
        }
      }, 0);

    // נשתמש במשתנה לנהל את scaleX של ::after
    const obs = new MutationObserver(() => {
      const v = img.style.getPropertyValue("--maskScaleX");
      if (v) img.style.setProperty("--maskScaleX", v);
    });
    obs.observe(img, { attributes: true, attributeFilter: ["style"] });

    // נרנדר את ה־::after לפי המשתנה (פעם אחת)
    const style = document.createElement("style");
    style.textContent = `
      .design-img::after { transform: scaleX(var(--maskScaleX, 1)); }
    `;
    document.head.appendChild(style);
  });

  /* -------- Quotes/Headers קטנים בין סקשנים -------- */
  gsap.utils.toArray("section h3, section h2").forEach((title) => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: "top 85%", once: true },
      y: 16, opacity: 0, duration: .6, ease: "power2.out"
    });
  });

  /* -------- Modal Animations -------- */
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const caption = document.getElementById("caption");
  const closeBtn = document.querySelector(".btn-close-modal");

  // פותחים תמונה למודאל (אם כבר יש לך לוגיקה ב-script.js, זה משלים רק את האנימציה)
  function openModalAnimation() {
    gsap.killTweensOf(modal);
    gsap.set(modal, { opacity: 0, display: "block" });
    modal.classList.add("is-open");
    gsap.fromTo(".modal-box",
      { y: 20, opacity: 0, scale: .98 },
      { y: 0, opacity: 1, scale: 1, duration: .35, ease: "power2.out" }
    );
    gsap.to(modal, { opacity: 1, duration: .25, ease: "power1.out" });
  }
  function closeModalAnimation() {
    gsap.killTweensOf(modal);
    const tl = gsap.timeline({
      onComplete: () => {
        modal.classList.remove("is-open");
        gsap.set(modal, { display: "none" });
      }
    });
    tl.to(".modal-box", { y: 10, opacity: 0, scale: .98, duration: .25, ease: "power1.in" })
      .to(modal, { opacity: 0, duration: .2, ease: "power1.in" }, 0);
  }

  // חיבור עדין — אם ה־script.js שלך כבר מטפל בפתיחה/סגירה, רק תחליף לקרוא לפונקציות האלה
  if (modal && closeBtn) {
    closeBtn.addEventListener("click", closeModalAnimation);
    // ESC ליציאה
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModalAnimation();
    });
    // קליק ברקע — סגירה
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModalAnimation();
    });
  }

  // אקספורט קל לשימוש מתוך קבצים אחרים (למשל script.js שלך)
  window.GBAnimations = {
    openModalAnimation,
    closeModalAnimation
  };

  /* -------- נגישות: דילוג אנימציות אם reduce-motion -------- */
  if (reduceMotion) {
    // נשבית טריגרים של גלילה כדי לא להעמיס
    ScrollTrigger.getAll().forEach(st => st.disable());
  }
})();
