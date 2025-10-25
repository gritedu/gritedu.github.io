import { auth, signOut } from "/assets/js/firebase-init.js";

const HEADER_HEIGHT = 64;

function headerTemplate() {
  return `
  <header class="grit-header fixed" style="height:${HEADER_HEIGHT}px;position:fixed;top:0;left:0;right:0;z-index:1000;">
    <div class="grit-header__wrap" style="height:${HEADER_HEIGHT}px;display:flex;align-items:center;justify-content:space-between;">
      <a class="grit-logo" href="/" aria-label="그릿에듀 홈">
        <img src="/assets/logo.png" alt="그릿에듀" class="grit-logo" style="height:40px">
      </a>
      <nav class="grit-nav" aria-label="주 메뉴">
        <ul style="display:flex;gap:16px;align-items:center;margin:0;padding:0;list-style:none;">
          <li><a href="/">그릿에듀</a></li>
          <li><a href="/story.html">이야기</a></li>
          <li><a href="/instructors.html">강사진</a></li>
          <li><a href="/gallery.html">갤러리</a></li>
          <li><a href="/contact.html">문의</a></li>
          <li><a href="/members/dashboard.html" id="menu-myclass" style="display:none;">내 강의실</a></li>
          <li><a href="/login.html" id="menu-login">로그인</a></li>
          <li><a href="#" id="menu-logout" style="display:none;">로그아웃</a></li>
        </ul>
      </nav>
    </div>
    <!-- 토글 버튼은 여기 것만 사용 -->
    <button class="menu-toggle" id="menuToggle" aria-label="메뉴 열기/닫기"><span></span><span></span><span></span></button>
  </header>`;
}

function footerTemplate() {
  return `
  <footer class="grit-footer" style="margin-top:40px">
    <div class="grit-footer-inner">
      <div class="grit-footer-sns">
        <a href="https://www.instagram.com/grit_edu_seoul/" target="_blank" rel="noopener" aria-label="Instagram" class="sns">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="#222"/>
            <circle cx="12" cy="12" r="5.2" fill="#fff"/>
            <circle cx="12" cy="12" r="3.8" fill="#222"/>
            <circle cx="17.5" cy="6.5" r="1" fill="#fff"/>
          </svg>
        </a>
        <a href="https://www.youtube.com/@gritedu_official" target="_blank" rel="noopener" aria-label="YouTube" class="sns">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="#222"/>
            <polygon points="10,8 16,12 10,16" fill="#fff"/>
          </svg>
        </a>
        <a href="https://blog.naver.com/gritedu" target="_blank" rel="noopener" aria-label="Naver Blog" class="sns">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" fill="#222"/>
            <path d="M8 7h2.6l3 4.3V7H16v10h-2.6L10.4 12v5H8Z" fill="#fff"></path>
          </svg>
        </a>
      </div>
      <p>© 2025 그릿에듀 | 서울 금천구 시흥대로47길 28-5 남서울교육문화센터 5층</p>
      <p>Tel : 02-809-0611</p>
    </div>
  </footer>`;
}

export function injectCommonUI() {
  try {
    // 1) 헤더/푸터 주입(있으면 교체)
    const existHeader = document.querySelector('.grit-header');
    const headerHtml = headerTemplate();
    if (existHeader) existHeader.outerHTML = headerHtml;
    else document.body.insertAdjacentHTML('afterbegin', headerHtml);

    const existFooter = document.querySelector('.grit-footer');
    const footerHtml = footerTemplate();
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

    // 3) 햄버거 메뉴 토글 (이 버튼만 사용)
    const navList = document.querySelector('.grit-nav ul');
    const menuBtn = document.getElementById('menuToggle');
    if (menuBtn && navList) {
      menuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuBtn.classList.toggle('active');
      });
      // 외부 클릭/ESC 닫기
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

    // 4) 현재 페이지 활성 메뉴
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
    document.body.insertAdjacentHTML('beforeend',
      '<button id="goTop" class="grit-top" aria-label="맨 위로" style="opacity:0;position:fixed;right:16px;bottom:16px;">▲</button>'
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

// 로드 훅
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectCommonUI);
} else {
  injectCommonUI();
}
