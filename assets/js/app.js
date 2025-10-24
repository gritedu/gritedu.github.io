// ---------------------- 햄버거 ----------------------
window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('site-nav');
  if (hamburger && nav && !hamburger.__bound) {
    const toggleNav = () => {
      const opened = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
      document.body.classList.toggle('nav-open', opened);
    };
    hamburger.addEventListener('click', toggleNav);
    nav.addEventListener('click', (e)=>{ if (e.target === nav && nav.classList.contains('open')) toggleNav(); });
    window.addEventListener('resize', ()=>{ if (window.innerWidth > 860) { nav.classList.remove('open'); document.body.classList.remove('nav-open'); hamburger.setAttribute('aria-expanded','false'); }});
    hamburger.__bound = true;
  }
});

// ---------------------- 임시 Auth ----------------------
const AUTH_KEY = 'grit_auth_v1';
const loadAuth = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)||'null'); } catch { return null; } };
let auth = loadAuth() || { loggedIn:false, email:'' };
const saveAuth = () => localStorage.setItem(AUTH_KEY, JSON.stringify(auth));

function syncAuthUI(){
  const loginBtn  = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuLearn = document.getElementById('menuLearn');
  const emailEl   = document.getElementById('headerEmail');
  const dlg       = document.getElementById('loginDialog');

  const loggedIn = !!auth.loggedIn;

  if (loginBtn)  loginBtn.style.display  = loggedIn ? 'none' : 'inline-flex';
  if (logoutBtn) logoutBtn.style.display = loggedIn ? 'inline-flex' : 'none';
  if (menuLearn) menuLearn.style.display = loggedIn ? '' : 'none';

  if (emailEl) {
    if (loggedIn && auth.email) {
      emailEl.textContent = auth.email;
      emailEl.hidden = false;
    } else {
      emailEl.hidden = true;
      emailEl.textContent = '';
    }
  }

  // 로그인 버튼: 모달만 열기
  if (loginBtn && !loginBtn.__bound){
    loginBtn.addEventListener('click', (e)=>{ e.preventDefault(); if (dlg?.showModal) dlg.showModal(); });
    loginBtn.__bound = true;
  }

  if (logoutBtn && !logoutBtn.__bound){
    logoutBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      auth = { loggedIn:false, email:'' };
      saveAuth(); syncAuthUI();
      if (location.pathname.endsWith('learn.html')) location.href = '/';
    });
    logoutBtn.__bound = true;
  }
}
window.addEventListener('DOMContentLoaded', syncAuthUI);

// ---------------------- 로그인 모달(임시) ----------------------
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const dlg  = document.getElementById('loginDialog');
  if (!form || form.__bound) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value?.trim();
    auth = { loggedIn:true, email: email || 'member@grit.edu' }; // 임시
    saveAuth(); syncAuthUI();
    if (dlg?.close) dlg.close();
    // 원하면 자동 이동: location.href = './learn.html';
  });
  form.__bound = true;
});

// ---------------------- learn.html 전환 ----------------------
function renderLearn(){
  const guest  = document.querySelector('.guest-view');
  const member = document.querySelector('.member-view');
  const nameEl = document.getElementById('memberName');
  if (!guest || !member) return;

  auth = loadAuth() || { loggedIn:false, email:'' };
  if (auth.loggedIn){
    guest.hidden = true;  member.hidden = false;
    if (nameEl) nameEl.textContent = (auth.email ? auth.email.split('@')[0] : '회원');
  } else {
    guest.hidden = false; member.hidden = true;
  }
}
window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.endsWith('learn.html')) renderLearn();
});

// ---------------------- Back-to-Top ----------------------
window.addEventListener('DOMContentLoaded', () => {
  const btt = document.getElementById('backToTop');
  if (!btt) return;
  const onScroll = () => btt.style.display = (window.scrollY > 300) ? 'flex' : 'none';
  window.addEventListener('scroll', onScroll, { passive:true });
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  onScroll();
});