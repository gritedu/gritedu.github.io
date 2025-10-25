// assets/js/common.js
import { auth, signOut } from "/assets/js/firebase-init.js";

const HEADER_HEIGHT = 64;

/* ---------- HEADER / FOOTER Templates (정적 마크업 주입) ---------- */
function headerTemplate() {
  return `
<header class="grit-header fixed" aria-label="Site header" style="position:fixed;top:0;left:0;right:0;z-index:1000;background:#fff;border-bottom:1px solid #eee;box-shadow:0 2px 6px rgba(0,0,0,.05);">
  <div class="grit-header__wrap" style="max-width:1080px;margin:0 auto;height:${HEADER_HEIGHT}px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;position:relative;">
    <!-- 좌측: 로고 -->
    <a class="grit-logo" href="/" aria-label="그릿에듀 홈" style="display:flex;align-items:center;gap:8px;">
      <img src="/assets/logo.png" alt="그릿에듀" style="height:40px;width:auto;display:block;">
    </a>

    <!-- 중앙: 내비게이션 -->
    <nav class="grit-nav" aria-label="주 메뉴" style="flex:1;display:flex;justify-content:center;">
      <ul style="display:flex;gap:20px;list-style:none;margin:0;padding:0;align-items:center;">
        <li><a href="/" class="grit-link">그릿에듀</a></li>
        <li><a href="/story.html" class="grit-link">이야기</a></li>
        <li><a href="/instructors.html" class="grit-link">강사진</a></li>
        <li><a href="/gallery.html" class="grit-link">갤러리</a></li>
        <li><a href="/contact.html" class="grit-link">문의</a></li>
        <li><a href="/members/dashboard.html" id="menu-myclass" class="grit-link" style="display:none;">내 강의실</a></li>
      </ul>
    </nav>

    <!-- 우측: 인증 -->
    <div class="grit-auth" style="display:flex;gap:12px;align-items:center;">
      <a href="/login.html" id="menu-login" class="grit-link">로그인</a>
      <a href="#" id="menu-logout" class="grit-link" style="display:none;">로그아웃</a>
    </div>

    <!-- 모바일 토글 (데스크탑 숨김, CSS 미디어쿼리로 제어) -->
    <button class="menu-toggle" id="menuToggle" aria-label="메뉴 열기/닫기" style="display:none;position:absolute;right:16px;top:20px;width:28px;height:24px;padding:0;border:0;background:transparent;cursor:pointer;">
      <span style="display:block;height:3px;background:#333;margin:5px 0;border-radius:2px;transition:.3s;"></span>
      <span style="display:block;height:3px;background:#333;margin:5px 0;border-radius:2px;transition:.3s;"></span>
      <span style="display:block;height:3px;background:#333;margin:5px 0;border-radius:2px;transition:.3s;"></span>
    </button>
  </div>
</header>`;
}

function footerTemplate() {
  return `
<footer class="grit-footer" style="margin-top:40px;border-top:1px solid #eee;background:#fff;">
  <div class="grit-footer-inner" style="max-width:1080px;margin:0 auto;padding:20px 16px;text-align:center;">
    <div class="grit-footer-sns" style="display:flex;justify-content:center;gap:16px;margin-bottom:8px;">
      <a href="https://www.instagram.com/grit_edu_seoul/" target="_blank" rel="noopener" aria-label="Instagram" class="sns" style="opacity:.85;">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#222"></rect>
          <circle cx="12" cy="12" r="5.2" fill="#fff"></circle>
          <circle cx="12" cy="12" r="3.8" fill="#222"></circle>
          <circle cx="17.5" cy="6.5" r="1" fill="#fff"></circle>
        </svg>
      </a>
      <a href="https://www.youtube.com/@gritedu_official" target="_blank" rel="noopener" aria-label="YouTube" class="sns" style="opacity:.85;">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#222"></rect>
          <polygon points="10,8 16,12 10,16" fill="#fff"></polygon>
        </svg>
      </a>
      <a href="https://blog.naver.com/gritedu" target="_blank" rel="noopener" aria-label="Naver Blog" class="sns" style="opacity:.85;">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#222"></rect>
          <path d="M8 7h2.6l3 4.3V7H16v10h-2.6L10.4 12v5H8Z" fill="#fff"></path>
        </svg>
      </a>
    </div>
    <p style="margin:4px 0;color:#333;">© 2025 그릿에듀 | 서울 금천구 시흥대로47길 28-5 남서울교육문화센터 5층</p>
    <p style="margin:4px 0;color:#333;">Tel : 02-809-0611</p>
  </div>
</footer>`;
}

/* ---------- Bootstrapping ---------- */
export function injectCommonUI() {
  try {
    // 1) 헤더/푸터 주입(있으면 교체)
    const headerHtml = headerTemplate();
    const footerHtml = footerTemplate();

    const existHeader = document.querySelector('.grit-header');
    if (existHeader) existHeader.outerHTML = headerHtml;
    else document.body.insertAdjacentHTML('afterbegin', headerHtml);

    const existFooter = document.querySelector('.grit-footer');
    if (existFooter) existFooter.outerHTML = footerHtml;
    else document.body.insertAdjacentHTML('beforeend', footerHtml);

    // 2) 헤더 스페이서(중복 생성 방지)
    if (!document.querySelector('.grit-header-spacer')) {
      const spacer = document.createElement('div');
      spacer.className = 'grit-header-spacer';
      spacer.style.height = HEADER_HEIGHT + 'px';
      const headerEl = document.querySelector('.grit-header');
      headerEl.insertAdjacentElement('afterend', spacer);
    }

    // 3) 메뉴 토글 (이 버튼만 사용)
    const navList = document.querySelector('.grit-nav ul');
    const menuBtn = document.getElementById('menuToggle');

    if (menuBtn && navList) {
      // 모바일에서만 버튼이 보이도록: CSS 미디어쿼리에서 display 제어
      menuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuBtn.classList.toggle('active');
      });

      // 바깥 클릭/ESC 닫기
      document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navList.contains(e.target)) {
          navList.classList.remove('active');
          menuBtn.classList.remove('active');
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          navList.classList.remove('active');
          menuBtn.classList.remove('active');
        }
      });
    }

    // 4) 현재 페이지 활성 메뉴 표시
    const path = location.pathname;
    document.querySelectorAll('.grit-nav a').forEach(a => {
      const href = new URL(a.href, location.origin).pathname;
      if (href === "/" && (path === "/" || path === "/index.html")) a.classList.add('is-active');
      else if (href === path) a.classList.add('is-active');
    });

    // 5) 맨위로 버튼
    ensureTopButton();

    // 6) 로그인 상태에 따른 메뉴 표시
    const menuMyClass = document.getElementById("menu-myclass");
    const menuLogin = document.getElementById("menu-login");
    const menuLogout = document.getElementById("menu-logout");

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
  } catch (err) {
    console.error("injectCommonUI error:", err);
  }
}

function ensureTopButton() {
  let btn = document.getElementById('goTop');
  if (!btn) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<button id="goTop" class="grit-top" aria-label="맨 위로" style="opacity:0;position:fixed;right:16px;bottom:16px;background:#ff7a00;color:#fff;border:none;border-radius:50%;width:48px;height:48px;font-size:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,.25);cursor:pointer;transition:.25s">▲</button>'
    );
    btn = document.getElementById('goTop');
  }
  btn.style.display = 'flex';
  btn.style.zIndex = '9999';
  const onScroll = () => { btn.style.opacity = (window.scrollY > 300) ? '1' : '0'; };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  onScroll();
}

// 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectCommonUI);
} else {
  injectCommonUI();
}
