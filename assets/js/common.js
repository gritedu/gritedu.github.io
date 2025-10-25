const HEADER_HEIGHT = 64;

export function injectCommonUI() {
  const headerTpl = `
  <header class="grit-header fixed" style="height:${HEADER_HEIGHT}px">
    <div class="grit-header__wrap" style="height:${HEADER_HEIGHT}px">
      <a class="grit-logo" href="./" aria-label="그릿에듀 홈">
        <img src="./assets/logo.png" alt="그릿에듀" class="grit-logo">
      </a>
      <nav class="grit-nav" aria-label="주 메뉴">
        <ul>
          <li><a href="./">그릿에듀</a></li>
          <li><a href="./story.html">이야기</a></li>
          <li><a href="./instructors.html">강사진</a></li>
          <li><a href="./gallery.html">갤러리</a></li>
          <li><a href="./contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>`;

  const footerTpl = `
  <footer class="grit-footer">
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

  // 1) 기존 헤더/푸터 있으면 교체, 없으면 주입
  const existHeader = document.querySelector('.grit-header');
  if (existHeader) existHeader.outerHTML = headerTpl; else document.body.insertAdjacentHTML('afterbegin', headerTpl);

  // 햄버거 메뉴 토글 로직
  const header = document.querySelector('.grit-header');
  const nav = header.querySelector('nav ul');
  header.insertAdjacentHTML('beforeend','<div class="menu-toggle" id="menuToggle"><span></span><span></span><span></span></div>');
  const menuBtn = document.getElementById('menuToggle');
  menuBtn.addEventListener('click',()=>{nav.classList.toggle('active');menuBtn.classList.toggle('active');});

  // 2) 고정 높이를 위한 스페이서(한 번만)
  if (!document.querySelector('.grit-header-spacer')) {
    const spacer = document.createElement('div');
    spacer.className = 'grit-header-spacer';
    spacer.style.height = HEADER_HEIGHT + 'px';
    document.body.insertBefore(spacer, document.body.firstElementChild.nextElementSibling);
  }

  const existFooter = document.querySelector('.grit-footer');
  if (existFooter) existFooter.outerHTML = footerTpl; else document.body.insertAdjacentHTML('beforeend', footerTpl);

  // 3) 현재 페이지 활성 메뉴
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.grit-nav a').forEach(a=>{
    if (a.getAttribute('href').endsWith(page)) a.classList.add('is-active');
  });

  // 4) 맨위로 버튼 추가
  ensureTopButton();
}

function ensureTopButton(){
  let btn = document.getElementById('goTop');
  if(!btn){
    document.body.insertAdjacentHTML('beforeend',
      '<button id="goTop" class="grit-top" aria-label="맨 위로" style="opacity:0">▲</button>'
    );
    btn = document.getElementById('goTop');
  }
  btn.style.display = 'flex';
  btn.style.zIndex = '9999';
  const onScroll = () => { btn.style.opacity = (window.scrollY > 300) ? '1' : '0'; };
  window.addEventListener('scroll', onScroll, { passive:true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  onScroll();
}

// 로그인 상태에 따른 메뉴 표시 제어
import { auth } from "./firebase-init.js";

const menuMyClass = document.getElementById("menu-myclass");
const menuLogin = document.getElementById("menu-login");
const menuLogout = document.getElementById("menu-logout");

// 로그인 상태 감시
auth.onAuthStateChanged(user => {
  const loggedIn = !!user;
  if (menuMyClass) menuMyClass.style.display = loggedIn ? "inline-block" : "none";
  if (menuLogin) menuLogin.style.display = loggedIn ? "none" : "inline-block";
  if (menuLogout) menuLogout.style.display = loggedIn ? "inline-block" : "none";
});

// 로그아웃 버튼 클릭 시 처리
if (menuLogout) {
  menuLogout.addEventListener("click", async (e) => {
    e.preventDefault();
    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js");
    await signOut(auth);
    location.href = "./index.html"; // 로그아웃 후 메인으로 이동
  });
}

document.addEventListener('DOMContentLoaded', injectCommonUI);
