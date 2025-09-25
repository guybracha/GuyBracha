/* gsap-init.js
   אנימציות גלובליות + חשיפות בגלילה + פירול אוטומטי
*/
(() => {
  if (!window.gsap) return; // הגנה אם GSAP לא נטען
  const { gsap } = window;
  const hasReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const baseDur = hasReduced ? 0 : 0.9;
  const ease = "power3.out";

  // ===== Header shrink on scroll (לוגיקה קלה – אם תרצה להשאיר רק כאן ולהסיר מ-script.js) =====
  const header = document.querySelector(".site-header");
  if (header) {
    const toggleShrink = () => {
      const y = window.scrollY || window.pageYOffset;
      header.classList.toggle("shrink", y > 40);
    };
    toggleShrink();
    window.addEventListener("scroll", toggleShrink, { passive: true });
  }

  // ===== Hero intro (תמונה, כותרת, תת-כותרת, כפתורים) =====
  const tlHero = gsap.timeline({ defaults: { ease, duration: baseDur } });
  tlHero
    .from(".header-avatar", { y: 20, opacity: 0 }, 0)
    .from(".brand-title",   { y: 12, opacity: 0 }, 0.05)
    .from(".brand-subtitle",{ y: 12, opacity: 0 }, 0.15)
    .from(".site-header nav .btn-cta", {
      opacity: 0, y: 10, stagger: 0.08
    }, 0.25);

  // ===== חשיפת כותרות/פסקאות/רשימות בכל הסקשנים =====
  gsap.utils.toArray("section, article").forEach((sec) => {
    const kids = sec.querySelectorAll("h2, h3, p, ul, ol");
    if (!kids.length) return;
    gsap.from(kids, {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: baseDur,
      ease,
      scrollTrigger: {
        trigger: sec,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // ===== כרטיסים (Projects) – קפיצה רכה בעת כניסה לתצוגה =====
  gsap.utils.toArray(".card").forEach((card) => {
    gsap.from(card, {
      opacity: 0,
      y: 18,
      duration: baseDur,
      ease,
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // ===== חשיפת תמונות עם "מסכה" (הפס השחור שמחליק) =====
  // עובד ע"י אנימציה של משתנה CSS --maskScaleX מ-1 ל-0
  const revealImgs = document.querySelectorAll(".design-img");
  revealImgs.forEach((img) => {
    // סט מראש (למקרה והדף נטען באמצע)
    img.style.setProperty("--maskScaleX", "1");
    gsap.to(img, {
      "--maskScaleX": 0,
      duration: baseDur + 0.2,
      ease,
      scrollTrigger: {
        trigger: img,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => img.style.setProperty("--maskScaleX", "0"),
        onLeaveBack: () => img.style.setProperty("--maskScaleX", "1"),
      },
    });
    gsap.from(img, {
      opacity: 0,
      y: 14,
      duration: baseDur,
      ease,
      scrollTrigger: {
        trigger: img,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // ===== אנימציית פתיחה למודאל (כשנפתח ב-script.js נצית קלאס is-open) =====
  // נקשיב לשינויים ב-attribute של המודאל כדי להריץ אנימציה
  const modal = document.querySelector(".custom-modal");
  const modalBox = document.querySelector(".modal-box");
  if (modal && modalBox) {
    const openTl = gsap.timeline({ paused: true });
    openTl
      .fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" })
      .from(modalBox, { y: 28, opacity: 0, duration: 0.35, ease }, 0);

    const obs = new MutationObserver(() => {
      const isOpen = modal.classList.contains("is-open");
      if (hasReduced) {
        modal.style.opacity = isOpen ? "1" : "0";
        return;
      }
      if (isOpen) openTl.play(0);
      else openTl.reverse();
    });
    obs.observe(modal, { attributes: true, attributeFilter: ["class"] });
  }

  // ===== פרלקסה קלה לכותרת (אופציונלי, עדין) =====
  const heroBits = [".header-avatar", ".brand-title", ".brand-subtitle"];
  heroBits.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.to(el, {
      yPercent: i === 0 ? -4 : -2,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: 0.3,
      },
    });
  });
})();
