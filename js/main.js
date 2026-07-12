/* Portfólio — Josias Cavalcante
   Tema, menu mobile, efeito de digitação, reveal on scroll e lightbox. */

(function () {
    "use strict";

    var html = document.documentElement;

    /* ---------- Tema claro/escuro ---------- */
    var stored = localStorage.getItem("theme");
    if (stored === "light" || (!stored && window.matchMedia("(prefers-color-scheme: light)").matches)) {
        html.setAttribute("data-theme", "light");
    }

    document.querySelector(".theme-toggle").addEventListener("click", function () {
        var isLight = html.getAttribute("data-theme") === "light";
        if (isLight) {
            html.removeAttribute("data-theme");
            localStorage.setItem("theme", "dark");
        } else {
            html.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    });

    /* ---------- Menu mobile ---------- */
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu = document.querySelector(".nav-menu");

    navToggle.addEventListener("click", function () {
        var open = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    navMenu.addEventListener("click", function (e) {
        if (e.target.classList.contains("nav-link")) {
            navMenu.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });

    /* ---------- Efeito de digitação ---------- */
    var roles = [
        "Analista de Dados",
        "Especialista em Power BI",
        "Automação com Python",
        "SQL & Modelagem de Dados"
    ];
    var typedOutput = document.querySelector(".typed-output");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
        typedOutput.textContent = roles[0];
    } else {
        var roleIndex = 0, charIndex = 0, deleting = false;
        (function type() {
            var current = roles[roleIndex];
            charIndex += deleting ? -1 : 1;
            typedOutput.textContent = current.slice(0, charIndex);

            var delay = deleting ? 40 : 85;
            if (!deleting && charIndex === current.length) {
                delay = 2000;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 400;
            }
            setTimeout(type, delay);
        })();
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }

    /* ---------- Link ativo na navegação ---------- */
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-link");

    function setActiveLink() {
        var pos = window.scrollY + 120;
        var currentId = "";
        sections.forEach(function (sec) {
            if (sec.offsetTop <= pos) currentId = sec.id;
        });
        navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
        });
    }
    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();

    /* ---------- Lightbox ---------- */
    var lightbox = document.querySelector(".lightbox");
    var lightboxImg = lightbox.querySelector("img");

    document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            lightboxImg.src = btn.getAttribute("data-lightbox");
            lightboxImg.alt = btn.querySelector("img") ? btn.querySelector("img").alt : "";
            lightbox.hidden = false;
            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImg.src = "";
        document.body.style.overflow = "";
    }
    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });

    /* ---------- Voltar ao topo ---------- */
    var backToTop = document.querySelector(".back-to-top");
    window.addEventListener("scroll", function () {
        backToTop.classList.toggle("visible", window.scrollY > 600);
    }, { passive: true });

    /* ---------- Ano do rodapé ---------- */
    document.querySelector(".year").textContent = new Date().getFullYear();
})();
