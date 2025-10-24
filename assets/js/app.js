// 중앙 데이터
import { INSTRUCTORS } from './data.instructors.js';
import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// ---- Auth 상태 ----
const AUTH_KEY = 'grit_auth_v1';
function loadAuth(){ try { return JSON.parse(localStorage.getItem(AUTH_KEY)||'null'); } catch { return null; } }
let auth = loadAuth() || { loggedIn:false, name:'' };

function saveAuth(){ localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); }

function syncGlobalUI(){
  const loginBtn  = document.getElementById('btnOpenLogin');
  const navUser   = document.getElementById('navUser');
  const menuLearn = document.querySelector('a[href="./learn.html"]');

  if (loginBtn) {
    if (auth.loggedIn) {
      loginBtn.textContent = "로그아웃";
      loginBtn.dataset.state = "logout";
    } else {
      loginBtn.textContent = "로그인";
      loginBtn.dataset.state = "login";
    }
  }
  
  if (navUser) {
    if (auth.loggedIn) {
      navUser.classList.remove("hidden");
      navUser.textContent = auth.name || '회원';
    } else {
      navUser.classList.add("hidden");
      navUser.textContent = "";
    }
  }
  
  if (menuLearn) {
    menuLearn.style.display = auth.loggedIn ? '' : 'none';
  }
}

/* ===== 엔터로 로그인 ===== */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('guestEmail')?.value.trim();
    const password = document.getElementById('guestPassword')?.value;
    const error = document.getElementById('guestError');
    
    if (error) error.textContent = '';
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 성공 시 로컬 상태 업데이트
      auth = { loggedIn: true, name: email.split('@')[0] };
      saveAuth();
      syncGlobalUI();
      if (location.pathname.endsWith('learn.html')) renderLearn();
    } catch (err) {
      if (error) error.textContent = err.message || String(err);
    }
  });
}

/* ===== 모바일 메뉴 개선 ===== */
window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('mainMenu');

  if (hamburger && nav && !hamburger.__bound) {
    const toggleNav = () => {
      const opened = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
      document.body.classList.toggle('nav-open', opened);
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });
    
    // 네비 빈 공간 클릭 시 닫기
    nav.addEventListener('click', (e) => {
      if (e.target === nav && nav.classList.contains('open')) toggleNav();
    });
    
    // 리사이즈 시 상태 초기화
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && nav.classList.contains('open')) {
        nav.classList.remove('open');
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    hamburger.__bound = true; // 중복 바인딩 방지
  }
});

// --- 강사진 필터 ---
window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelector('.filter-tabs');
  const grid = document.getElementById('instructorGrid');
  if (!tabs || !grid) return;

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    tabs.querySelectorAll('.tab').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const f = btn.dataset.filter; // all | kor | math | eng | sci
    grid.querySelectorAll('.instructor-card').forEach(card => {
      const cat = card.dataset.cat;
      const show = (f === 'all') || (cat === f);
      card.style.display = show ? 'block' : 'none';
    });
  });
});

// --- Back to Top ---
window.addEventListener('DOMContentLoaded', () => {
  const btt = document.getElementById('backToTop');
  if (!btt) return;
  const onScroll = () => btt.style.display = (window.scrollY > 300) ? 'flex' : 'none';
  window.addEventListener('scroll', onScroll, { passive:true });
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  onScroll();
});

// ---- 로그아웃 핸들러 ----
window.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('btnOpenLogin');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (auth.loggedIn) {
        // 로그아웃
        auth = { loggedIn: false, name: '' };
        saveAuth();
        syncGlobalUI();
        if (location.pathname.endsWith('learn.html')) renderLearn();
      } else {
        // 로그인 다이얼로그 열기
        const dialog = document.getElementById('loginDialog');
        if (dialog) dialog.showModal();
      }
    });
  }
});

// ---- Learn 페이지 렌더링 ----
function renderLearn(){
  const guest  = document.querySelector('.guest-view');
  const member = document.querySelector('.member-view');
  const nameEl = document.getElementById('memberName');
  if (!guest || !member) return;

  auth = loadAuth() || { loggedIn:false, name:'' };
  if (auth.loggedIn) {
    guest.hidden = true;  member.hidden = false;
    if (nameEl) nameEl.textContent = auth.name || '회원';
  } else {
    guest.hidden = false; member.hidden = true;
  }
}

// ---- 초기화 ----
window.addEventListener('DOMContentLoaded', () => {
  syncGlobalUI();
  if (location.pathname.endsWith('learn.html')) {
    // "내 강의실" 버튼으로도 로그인 유도
    const goLogin = document.getElementById('goLogin');
    if (goLogin) goLogin.addEventListener('click', (e)=>{ e.preventDefault(); auth={loggedIn:true,name:'회원'}; saveAuth(); syncGlobalUI(); renderLearn(); });
    renderLearn();
  }
});