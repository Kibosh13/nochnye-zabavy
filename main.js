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

const phoneInput = groupDialog?.querySelector('input[name="Телефон"]');
const emailInput = groupDialog?.querySelector('input[name="Почта"]');
const groupForm = groupDialog?.querySelector("form");

const phoneDigits = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.startsWith("7")) digits = digits.slice(1);
  return digits.slice(0, 10);
};

const phoneMask = (digits) => {
  let result = "+7";
  if (!digits) return result;
  result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
};

phoneInput?.addEventListener("focus", () => {
  if (!phoneInput.value) phoneInput.value = "+7";
});

phoneInput?.addEventListener("input", () => {
  phoneInput.value = phoneMask(phoneDigits(phoneInput.value));
});

phoneInput?.addEventListener("blur", () => {
  if (phoneDigits(phoneInput.value).length === 0) phoneInput.value = "";
});

const emailProblem = (value) => {
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Введите почту в формате имя@сайт.ru";
  const domain = email.split("@")[1];
  const typos = ["gmail.ru", "gmail.con", "gmial.com", "gmal.com", "gmai.com", "yandex.con", "mail.con"];
  if (typos.includes(domain)) return "Проверьте почту: такой адрес похож на опечатку";
  return "";
};

groupForm?.addEventListener("submit", (event) => {
  const emailMessage = emailProblem(emailInput.value);
  emailInput.setCustomValidity(emailMessage);
  const digits = phoneDigits(phoneInput.value);
  phoneInput.setCustomValidity(digits.length === 0 || digits.length === 10 ? "" : "Телефон нужен в формате +7 (999) 999-99-99");
  if (!groupForm.reportValidity()) event.preventDefault();
});

emailInput?.addEventListener("input", () => emailInput.setCustomValidity(""));
phoneInput?.addEventListener("input", () => phoneInput.setCustomValidity(""));

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

  const frame = stage.querySelector(".stage-frame");
  let touchX = null;
  let swiped = false;

  frame.addEventListener("click", () => {
    if (swiped) {
      swiped = false;
      return;
    }
    show(current + 1);
    play();
  });

  frame.addEventListener("touchstart", (event) => {
    touchX = event.changedTouches[0].clientX;
  }, { passive: true });

  frame.addEventListener("touchend", (event) => {
    if (touchX == null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(delta) < 40) return;
    swiped = true;
    show(current + (delta < 0 ? 1 : -1));
    play();
  });

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
