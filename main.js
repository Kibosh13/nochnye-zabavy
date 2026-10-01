const TICKET_URL = "";

const nav = document.querySelector("#nav");
const toggle = document.querySelector(".nav-toggle");

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("is-open", !open);
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }
});

document.querySelectorAll(".js-tickets").forEach((link) => {
  if (TICKET_URL) {
    link.href = TICKET_URL;
    link.target = "_blank";
    link.rel = "noopener";
    return;
  }
  link.addEventListener("click", (event) => event.preventDefault());
});

document.querySelectorAll("[data-social]").forEach((link) => {
  if (link.getAttribute("href") === "#") {
    link.addEventListener("click", (event) => event.preventDefault());
  }
});

const groupDialog = document.querySelector("#group-dialog");
document.querySelector("[data-open-group]")?.addEventListener("click", () => groupDialog.showModal());
document.querySelector("[data-close-group]")?.addEventListener("click", () => groupDialog.close());

const links = [...document.querySelectorAll(".nav a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => observer.observe(section));

const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const stage = document.querySelector("[data-stage]");

if (stage) {
  const slides = [...stage.querySelectorAll(".stage-slide")];
  const dots = [...stage.querySelectorAll(".stage-dots button")];
  let current = 0;
  let timer = 0;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-on", i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-on", i === current);
      dot.setAttribute("aria-selected", String(i === current));
    });
  };

  const play = () => {
    window.clearInterval(timer);
    if (!motionOk) return;
    timer = window.setInterval(() => show(current + 1), 4500);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      show(index);
      play();
    });
  });

  stage.addEventListener("mouseenter", () => window.clearInterval(timer));
  stage.addEventListener("mouseleave", play);
  stage.addEventListener("focusin", () => window.clearInterval(timer));
  stage.addEventListener("focusout", play);
  play();
}

if (motionOk) {
  const revealNodes = document.querySelectorAll(
    ".section-head, .story-lead, .beat, .stage, .facts > div, .credits, .date, .partner, .cast li, .reviews blockquote"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealNodes.forEach((node) => {
    const siblings = [...node.parentElement.children];
    const index = siblings.indexOf(node);
    node.classList.add("reveal");
    node.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
    revealObserver.observe(node);
  });
}
