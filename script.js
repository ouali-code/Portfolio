const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;


function initTypewriter() {
  const target = document.getElementById("typewriter");
  const phrases = [
    "Je crée des sites web.",
    "J'automatise avec l'IA.",
    "Je gère votre administratif."
  ];

  if (!target) return;

  if (prefersReducedMotion) {
    target.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function step() {
    const phrase = phrases[phraseIndex];
    charIndex += isDeleting ? -1 : 1;
    target.textContent = phrase.slice(0, charIndex);

    let delay = isDeleting ? 28 : 60;

    if (!isDeleting && charIndex === phrase.length) {
      isDeleting = true;
      delay = 1700;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(step, delay);
  }

  step();
}


function animateCounter(element) {
  if (prefersReducedMotion) return;

  const finalValue = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const duration = 1500;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(finalValue * eased) + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.dataset.count) {
        animateCounter(entry.target);
      }

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  document
    .querySelectorAll(".reveal, .progress-bar, [data-count]")
    .forEach((element) => observer.observe(element));
}


function initProjectFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");

      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.hidden = !matches;

        if (matches) {
          card.classList.remove("is-visible");
          void card.offsetWidth;
          card.classList.add("is-visible");
        }
      });
    });
  });
}


function initTilt() {
  if (prefersReducedMotion || !canHover) return;

  document.querySelectorAll("[data-tilt]").forEach((element) => {
    const intensity = Number(element.dataset.tilt);

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;

      element.style.transform =
        "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale3d(1.02, 1.02, 1.02)";
      element.style.setProperty("--mx", x * 100 + "%");
      element.style.setProperty("--my", y * 100 + "%");
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}


initTypewriter();
initScrollAnimations();
initProjectFilters();
initTilt();
