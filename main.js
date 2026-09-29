const shows = {
  "msk-1": {
    title: "12 октября · Москва",
    meta: "Концертный зал «Площадка», 19:00"
  },
  "spb-1": {
    title: "26 октября · Санкт-Петербург",
    meta: "Театр «Площадка», 19:00"
  },
  "kzn-1": {
    title: "8 ноября · Казань",
    meta: "Зал «Площадка», 18:00"
  },
  "ekb-1": {
    title: "22 ноября · Екатеринбург",
    meta: "Дворец культуры «Площадка», 18:00"
  }
};

const nav = document.querySelector("#nav");
const toggle = document.querySelector(".nav-toggle");
const title = document.querySelector("#widget-title");
const meta = document.querySelector("#widget-meta");

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

document.querySelectorAll("[data-city-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const city = button.dataset.cityFilter;
    document.querySelectorAll("[data-city-filter]").forEach((item) => {
      item.classList.toggle("is-on", item === button);
    });
    document.querySelectorAll(".date").forEach((row) => {
      row.hidden = city !== "all" && row.dataset.city !== city;
    });
  });
});

function selectShow(id) {
  const show = shows[id];
  if (!show) return;
  title.textContent = show.title;
  meta.textContent = show.meta;
  document.querySelectorAll(".date").forEach((row) => {
    row.classList.toggle("is-picked", row.dataset.id === id);
  });
}

document.querySelectorAll("[data-buy]").forEach((link) => {
  link.addEventListener("click", () => selectShow(link.dataset.buy));
});

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

if (motionOk) {
  const revealNodes = document.querySelectorAll(
    ".section-head, .story-lead, .beat, .story-photo, .facts > div, .credits, .date, .cast li, .reviews blockquote, .tickets-copy, .widget"
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
