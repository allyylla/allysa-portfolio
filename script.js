// Allysa M. Pinca — Portfolio interactions
(() => {
  document.documentElement.classList.remove("no-js");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year
  $("#year").textContent = new Date().getFullYear();

  // Scroll progress + nav state
  const progress = $(".progress");
  const nav = $(".nav");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle("scrolled", scrollY > 20);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const links = $("#navLinks");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  menuBtn.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  $$("a", links).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Reveal on scroll, staggered within each parent
  const reveals = $$(".reveal");
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 6) * 0.08}s`);
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Active nav link
  const navMap = new Map($$(".nav-links a").map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove("active"));
      navMap.get(e.target.id)?.classList.add("active");
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => spy.observe(s));

  // Cursor-follow glow on cards
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // Subtle 3D tilt on project cards (fine pointers only)
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
    $$(".project").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
      });
      card.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
  }

  // Project detail toggles
  $$(".project .toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".project");
      const open = !card.classList.contains("open");
      card.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Screenshot lightbox
  const lightbox = $("#lightbox");
  const lbImg = $("img", lightbox);
  const lbCaption = $(".lightbox-caption", lightbox);
  $$(".project-visual").forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = $("img", btn);
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = $("h3", btn.closest(".project")).textContent;
      lightbox.showModal();
    });
  });
  $(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

  // Contact form — validates, then opens the visitor's email app pre-filled.
  // To receive messages without an email client, set FORM_ENDPOINT to a
  // Formspree (or similar) URL, e.g. "https://formspree.io/f/xxxxxxx".
  const FORM_ENDPOINT = "";
  const TO_EMAIL = "allysapinca19@gmail.com";
  const form = $("#contactForm");
  const status = $("#formStatus");
  const setStatus = (msg, isError = false) => {
    status.textContent = msg;
    status.classList.toggle("error", isError);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let ok = true;
    ["name", "email", "message"].forEach((k) => {
      const field = form.elements[k];
      const bad = !data[k].trim() || (k === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[k]));
      field.parentElement.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) return setStatus("Please fill in your name, a valid email, and a message.", true);

    if (FORM_ENDPOINT) {
      setStatus("Sending…");
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error();
        form.reset();
        return setStatus("Thank you! Your message has been sent. ✦");
      } catch {
        return setStatus("Something went wrong. Please email me directly.", true);
      }
    }

    const subject = data.subject.trim() || `Portfolio inquiry from ${data.name}`;
    const body = `${data.message}\n\n— ${data.name} (${data.email})`;
    location.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Opening your email app… thank you for reaching out! ✦");
  });

  form.addEventListener("input", (e) => e.target.parentElement.classList.remove("invalid"));
})();
