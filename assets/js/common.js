// /assets/js/common.js
import { auth, signOut } from "/assets/js/firebase-init.js";

const HEADER_HEIGHT = 64;

export function initCommonUI() {
  try {
    const headerEl = document.querySelector('.grit-header');
    const navList  = document.querySelector('.grit-nav ul');
    let   menuBtn  = document.getElementById('menuToggle');

    // 1) 헤더 높이만큼 spacer (중복 생성 방지)
    if (headerEl && !document.querySelector('.grit-header-spacer')) {
      const spacer = document.createElement('div');
      spacer.className = 'grit-header-spacer';
      spacer.style.height = HEADER_HEIGHT + 'px';
      headerEl.insertAdjacentElement('afterend', spacer);
    }

    // 2) 모바일 토글 버튼이 없으면 생성
    if (!menuBtn) {
      menuBtn = document.createElement('button');
      menuBtn.className = 'menu-toggle';
      menuBtn.id = 'menuToggle';
      menuBtn.setAttribute('aria-label','메뉴 열기/닫기');
      menuBtn.innerHTML = '<span></span><span></span><span></span>';
      const wrap = document.querySelector('.grit-header__wrap');
      if (wrap) wrap.appendChild(menuBtn);
    }

    // 3) 햄버거 토글
    if (menuBtn && navList) {
      const closeMenu = () => {
        navList.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.classList.remove('nav-open');
      };
      const openMenu = () => {
        navList.classList.add('active');
        menuBtn.classList.add('active');
        document.body.classList.add('nav-open');
      };
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navList.classList.contains('active') ? closeMenu() : openMenu();
      });
      document.addEventListener('click', (e) => {
        if (!navList.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    }

    // 4) 활성 메뉴 표시
    const path = location.pathname;
    document.querySelectorAll('.grit-nav a').forEach(a => {
      const href = new URL(a.href, location.origin).pathname;
      if (href === "/" && (path === "/" || path === "/index.html")) a.classList.add('is-active');
      else if (href === path) a.classList.add('is-active');
    });

    // 5) 로그인 상태에 따른 메뉴 표시
    const menuMyClass = document.getElementById("menu-myclass");
    const menuLogin   = document.getElementById("menu-login");
    const menuLogout  = document.getElementById("menu-logout");
    auth.onAuthStateChanged(user => {
      const loggedIn = !!user;
      if (menuMyClass) menuMyClass.style.display = loggedIn ? "inline-block" : "none";
      if (menuLogin)   menuLogin.style.display   = loggedIn ? "none" : "inline-block";
      if (menuLogout)  menuLogout.style.display  = loggedIn ? "inline-block" : "none";
    });
    if (menuLogout) {
      menuLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut(auth);
        location.href = "/";
      });
    }

    // 6) 맨위로 버튼(한 번만)
    ensureTopButton();
  } catch (err) {
    console.error("initCommonUI error:", err);
  }
}

function ensureTopButton() {
  if (document.getElementById('goTop')) return;
  document.body.insertAdjacentHTML(
    'beforeend',
    '<button id="goTop" class="grit-top" aria-label="맨 위로">▲</button>'
  );
  const btn = document.getElementById('goTop');
  btn.style.display = 'flex';
  btn.style.zIndex  = '9999';
  const onScroll = () => { btn.style.opacity = (window.scrollY > 300) ? '1' : '0'; };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  onScroll();
}

// 로드 훅
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommonUI);
} else {
  initCommonUI();
}