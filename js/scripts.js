/* ==========================================
   Daniel Díaz Rodríguez Portfolio
========================================== */

// ===============================
// Menú Responsive
// ===============================

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("nav ul");

if (menuToggle) {

  menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

  });

}

// ===============================
// Navbar Shadow
// ===============================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 20) {

    header.classList.add("shadow");

  } else {

    header.classList.remove("shadow");

  }

});

// ===============================
// Scroll Suave
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {

      target.scrollIntoView({

        behavior: "smooth"

      });

    }

    if (navMenu) {

      navMenu.classList.remove("active");

    }

  });

});

// ===============================
// Resaltar sección activa
// ===============================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop - 120;

    if (window.scrollY >= sectionTop) {

      current = section.getAttribute("id");

    }

  });

  navLinks.forEach(link => {

    link.classList.remove("current");

    if (link.getAttribute("href") === "#" + current) {

      link.classList.add("current");

    }

  });

});

// ===============================
// Animación de aparición
// ===============================

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add("show");

    }

  });

}, {
  threshold: 0.15
});

document.querySelectorAll("section").forEach(section => {

  section.classList.add("hidden");

  observer.observe(section);

});

// ===============================
// Botón Back To Top
// ===============================

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.id = "topButton";

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

  if (window.scrollY > 500) {

    topButton.classList.add("visible");

  } else {

    topButton.classList.remove("visible");

  }

});

topButton.addEventListener("click", () => {

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

});

// ===============================
// Footer Año Automático
// ===============================

const footerYear = document.getElementById("year");

if (footerYear) {

  footerYear.textContent = new Date().getFullYear();

}