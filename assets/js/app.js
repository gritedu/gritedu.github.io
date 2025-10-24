// ================================
// A) 공통 유틸: DOM 준비
// ================================
window.addEventListener('DOMContentLoaded', () => {
  attachBackToTop();
  bindHamburger();
  syncAuthUI();   // 로그인/로그아웃 버튼 + '내 강의실' 메뉴 토글
  if (location.pathname.endsWith('learn.html')) renderLearn(); // 학습실 전환
});

// ================================
// B) Back-to-Top
// ================================
function attachBackToTop(){
  const btt = document.getElementById('backToTop');
  if (!btt) return;
  const onScroll = () => btt.style.display = (window.scrollY > 300) ? 'flex' : 'none';
  window.addEventListener('scroll', onScroll, { passive:true });
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  onScroll();
}

// ================================
// C) 햄버거 안정화
// ================================
function bindHamburger(){
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('mainMenu');
  if (!hamburger || !nav || hamburger.__bound) return;
  const toggleNav = () => {
    const opened = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
    document.body.classList.toggle('nav-open', opened);
  };
  hamburger.addEventListener('click', toggleNav);
  nav.addEventListener('click', (e) => { if (e.target === nav && nav.classList.contains('open')) toggleNav(); });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && nav.classList.contains('open')) {
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded','false');
    }
  });
  hamburger.__bound = true;
}

// ================================
// D) 임시 Auth (Firebase 전까지 UI 확인용)
//  - localStorage로 로그인 상태 유지
//  - 로그인 시 '내 강의실' 메뉴 노출, 로그아웃 시 숨김
// ================================
const AUTH_KEY = 'grit_auth_v1';
const loadAuth = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; } };
let auth = loadAuth() || { loggedIn: false, name: '' };
const saveAuth = () => localStorage.setItem(AUTH_KEY, JSON.stringify(auth));

function syncAuthUI(){
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuLearn = document.getElementById('menuLearn');
  const dlg = document.getElementById('loginDialog');

  if (loginBtn)  loginBtn.style.display  = auth.loggedIn ? 'none' : 'inline-flex';
  if (logoutBtn) logoutBtn.style.display = auth.loggedIn ? 'inline-flex' : 'none';
  if (menuLearn) menuLearn.style.display = auth.loggedIn ? '' : 'none';

  if (loginBtn && !loginBtn.__bound){
    loginBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      // 🔸 바로 learn.html로 가지 않고, 로그인 모달만 열기
      if (dlg?.showModal) dlg.showModal();
    });
    loginBtn.__bound = true;
  }

  if (logoutBtn && !logoutBtn.__bound){
    logoutBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      auth = { loggedIn:false, name:'' };
      saveAuth(); syncAuthUI();
      if (location.pathname.endsWith('learn.html')) location.href = '/'; // 학습실에서 로그아웃하면 홈
    });
    logoutBtn.__bound = true;
  }
}

// ================================
// E) learn.html 전환
// ================================
function renderLearn(){
  const guest  = document.getElementById('guestView');
  const member = document.getElementById('memberView');
  const nameEl = document.getElementById('memberName');
  if (!guest || !member) return;

  auth = loadAuth() || { loggedIn:false, name:'' };
  if (auth.loggedIn){
    guest.hidden = true;  member.hidden = false;
    if (nameEl) nameEl.textContent = auth.name || '회원';
  } else {
    guest.hidden = false; member.hidden = true;
  }

  // 게스트뷰에서 '로그인' 눌렀을 때도 즉시 전환
  const goLogin = document.getElementById('goLogin');
  if (goLogin && !goLogin.__bound){
    goLogin.addEventListener('click', (e)=>{
      e.preventDefault();
      auth = { loggedIn:true, name:'회원' };
      saveAuth(); syncAuthUI(); renderLearn();
    });
    goLogin.__bound = true;
  }
}

// ================================
// F) 로그인 모달 처리 (임시)
// ================================
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const dlg  = document.getElementById('loginDialog');
  if (form && !form.__bound){
    form.addEventListener('submit', (e)=>{
      e.preventDefault(); // dialog 기본 submit 막음
      const email = document.getElementById('loginEmail')?.value?.trim();
      auth = { loggedIn:true, name: (email ? email.split('@')[0] : '회원') };
      saveAuth(); syncAuthUI();
      if (dlg?.close) dlg.close();
      // 필요시 내 강의실로 이동하려면 아래 주석 해제
      // location.href = './learn.html';
    });
    form.__bound = true;
  }
});