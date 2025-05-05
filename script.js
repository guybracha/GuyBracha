document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");

  document.querySelectorAll(".design-img").forEach(img => {
    img.addEventListener("click", function () {
      modal.classList.add("show");
      modalImg.src = this.src;
      captionText.textContent = this.alt;
    });
  });

  document.querySelector(".close").onclick = function () {
    modal.classList.remove("show");
  };

  // סגירה גם בלחיצה על רקע שחור
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.classList.remove("show");
  });
});
