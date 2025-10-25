// /assets/js/common.js
import { auth, signOut } from "/assets/js/firebase-init.js";

document.addEventListener("DOMContentLoaded", () => {
  setupMenuToggle();
  activateCurrentNav();
  setupAuthMenu();
  ensureTopButton();
});

function setupMenuToggle() {
  const navList = document.querySelector(".grit-nav ul");
  const menuBtn = document.getElementById("menuToggle");
  if (!menuBtn || !navList) return;

  const toggleMenu = () => {
    const active = navList.classList.toggle("active");
    menuBtn.classList.toggle("active", active);
    document.body.classList.toggle("nav-open", active);
  };

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  document.addEventListener("click", (e) => {
    if (!navList.contains(e.target) && !menuBtn.contains(e.target)) {
      navList.classList.remove("active");
      menuBtn.classList.remove("active");
      document.body.classList.remove("nav-open");
    }
  });
}

function activateCurrentNav() {
  const path = location.pathname;
  document.querySelectorAll(".grit-nav a").forEach(a => {
    const href = new URL(a.href, location.origin).pathname;
    if (href === "/" && (path === "/" || path === "/index.html")) a.classList.add("is-active");
    else if (href === path) a.classList.add("is-active");
  });
}

function setupAuthMenu() {
  const my = document.getElementById("menu-myclass");
  const login = document.getElementById("menu-login");
  const logout = document.getElementById("menu-logout");

  // 초기 상태 설정
  if (my) my.style.display = "none";
  if (login) login.style.display = "inline-block";
  if (logout) logout.style.display = "none";

  auth.onAuthStateChanged((user) => {
    const loggedIn = !!user;
    console.log("Auth state changed:", loggedIn, user?.email); // 디버깅용
    
    if (my) { 
      my.style.display = loggedIn ? "inline-block" : "none"; 
    }
    if (login) { 
      login.style.display = loggedIn ? "none" : "inline-block"; 
    }
    if (logout) { 
      logout.style.display = loggedIn ? "inline-block" : "none"; 
    }
  });

  if (logout) {
    logout.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut(auth);
      location.href = "/";
    });
  }
}

function ensureTopButton() {
  if (document.getElementById("goTop")) return;
  const btn = document.createElement("button");
  btn.id = "goTop";
  btn.className = "grit-top";
  btn.textContent = "▲";
  document.body.appendChild(btn);
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    btn.style.opacity = window.scrollY > 200 ? "1" : "0";
  });
}