// /assets/js/common.js
import { auth, signOut } from "/assets/js/firebase-init.js";

// ---- 모바일 메뉴 토글 ----
(function setupMobileMenu(){
  const nav = document.querySelector(".grit-nav");
  const btn = document.getElementById("menuToggle");
  const list = nav?.querySelector("ul");
  if (!btn || !list) return;

  const open = () => {
    list.classList.add("active");
    btn.classList.add("active");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    list.classList.remove("active");
    btn.classList.remove("active");
    document.body.style.overflow = "";
  };

  btn.addEventListener("click", () => {
    const isActive = list.classList.contains("active");
    isActive ? close() : open();
  });

  document.addEventListener("click", (e) => {
    if (!list.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// ---- 현재 페이지 활성 메뉴 ----
(function activateCurrentNav(){
  const path = location.pathname;
  document.querySelectorAll(".grit-nav a").forEach(a => {
    const href = new URL(a.href, location.origin).pathname;
    if (href === "/" && (path === "/" || path === "/index.html")) a.classList.add("is-active");
    else if (href === path) a.classList.add("is-active");
  });
})();

// ---- 로그인 상태에 따른 메뉴 표시 (레이아웃 흔들림 방지: opacity 전환) ----
(function setupAuthMenu(){
  const elMy = document.getElementById("menu-myclass");   // auth-in
  const elLogin = document.getElementById("menu-login");  // auth-out
  const elLogout = document.getElementById("menu-logout");// auth-in

  // 초기엔 자리를 유지하되 투명(깜빡임 최소화)
  [elMy, elLogin, elLogout].forEach(el => {
    if (el) el.style.opacity = "0";
  });

  auth.onAuthStateChanged((user) => {
    const loggedIn = !!user;

    if (elMy)    elMy.style.opacity    = loggedIn ? "1" : "0";
    if (elLogout)elLogout.style.opacity= loggedIn ? "1" : "0";
    if (elLogin) elLogin.style.opacity = loggedIn ? "0" : "1";
  });

  if (elLogout) {
    elLogout.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut(auth);
      location.href = "/";
    });
  }
})();

// ---- 맨 위로 버튼 (중복 생성 방지) ----
(function ensureTopButton(){
  if (document.getElementById("goTop")) return;
  const btn = document.createElement("button");
  btn.id = "goTop";
  btn.className = "grit-top";
  btn.setAttribute("aria-label", "맨 위로");
  btn.textContent = "▲";
  btn.style.display = "flex";
  document.body.appendChild(btn);

  const onScroll = () => { btn.style.opacity = (window.scrollY > 300) ? "1" : "0"; };
  window.addEventListener("scroll", onScroll, { passive:true });
  btn.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));
  onScroll();
})();