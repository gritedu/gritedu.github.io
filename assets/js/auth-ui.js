import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// 초기 로딩 시 깜빡임 방지
document.documentElement.classList.add('pre-init');

const btnOpenLogin = document.getElementById("btnOpenLogin");
const navUser      = document.getElementById("navUser");
const loginDialog  = document.getElementById("loginDialog");
const btnHamburger = document.getElementById("btnHamburger");
const mainMenu     = document.getElementById("mainMenu");

// localStorage에서 로그인 상태 복원
const savedLoginState = localStorage.getItem('isLoggedIn');
const savedUserName = localStorage.getItem('userName');

if (savedLoginState === 'true' && savedUserName) {
  navUser?.classList.remove("hidden");
  if (navUser) navUser.textContent = savedUserName;
  if (btnOpenLogin) { 
    btnOpenLogin.textContent = "로그아웃"; 
    btnOpenLogin.dataset.state = "logout"; 
  }
}

/* 햄버거 토글 */
btnHamburger?.addEventListener("click", ()=> mainMenu?.classList.toggle("open"));

/* 모달 닫기 */
document.querySelectorAll("[data-close]")?.forEach(b=> b.addEventListener("click", ()=> b.closest("dialog")?.close()));

/* 로그인/로그아웃 */
btnOpenLogin?.addEventListener("click", ()=>{
  if(btnOpenLogin.dataset.state==="logout") signOut(auth);
  else loginDialog?.showModal();
});

/* 로그인 실행 */
document.getElementById("doLogin")?.addEventListener("click", async ()=>{
  const email = document.getElementById("loginEmail")?.value.trim();
  const pw    = document.getElementById("loginPassword")?.value;
  const err   = document.getElementById("loginError");
  err.textContent = "";
  try{ await signInWithEmailAndPassword(auth, email, pw); loginDialog?.close(); }
  catch(e){ err.textContent = e.message || String(e); }
});

/* 상태 반영 + 이름표시(없으면 이메일/UID) */
onAuthStateChanged(auth, async (user)=>{
  if(user){
    let label = user.email ?? user.uid;
    try{
      const snap = await getDoc(doc(db, "users", user.uid));
      const u = snap.exists() ? snap.data() : null;
      if(u?.name) label = u.name;
    }catch(_){}
    
    // localStorage에 저장
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', label);
    
    navUser?.classList.remove("hidden");
    if(navUser) navUser.textContent = label;
    if(btnOpenLogin){ btnOpenLogin.textContent="로그아웃"; btnOpenLogin.dataset.state="logout"; }
  }else{
    // localStorage에서 제거
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    
    navUser?.classList.add("hidden"); if(navUser) navUser.textContent="";
    if(btnOpenLogin){ btnOpenLogin.textContent="로그인"; btnOpenLogin.dataset.state="login"; }
    mainMenu?.classList.remove("open"); // 로그아웃 시 메뉴 닫기
  }
  
  // DOM 로딩 완료 후 깜빡임 방지 해제
  document.documentElement.classList.remove('pre-init');
});