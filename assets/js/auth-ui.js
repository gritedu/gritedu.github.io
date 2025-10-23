// assets/js/auth-ui.js
import { auth } from "./firebase.js";
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// 헤더의 버튼/표시 영역
const btnOpenLogin = document.getElementById("btnOpenLogin");
const navUser = document.getElementById("navUser");

// 모달 요소
const loginDialog  = document.getElementById("loginDialog");
const signupDialog = document.getElementById("signupDialog");

// 공통 닫기
document.querySelectorAll("[data-close]")?.forEach(b=>{
  b.addEventListener("click", ()=> b.closest("dialog")?.close());
});

// 버튼 바인딩
btnOpenLogin?.addEventListener("click", ()=>{
  if (btnOpenLogin.dataset.state === "logout") signOut(auth);
  else loginDialog?.showModal();
});
document.getElementById("btnSignup")?.addEventListener("click", ()=> signupDialog?.showModal());

// 로그인 시도
document.getElementById("doLogin")?.addEventListener("click", async ()=>{
  const email = document.getElementById("loginEmail")?.value.trim();
  const pw    = document.getElementById("loginPassword")?.value;
  const errEl = document.getElementById("loginError");
  errEl.textContent = "";
  try{
    await signInWithEmailAndPassword(auth, email, pw);
    loginDialog?.close();
  }catch(e){ errEl.textContent = e.message || String(e); }
});

// 회원가입 시도
document.getElementById("doSignup")?.addEventListener("click", async ()=>{
  const email = document.getElementById("signupEmail")?.value.trim();
  const pw1   = document.getElementById("signupPassword")?.value;
  const pw2   = document.getElementById("signupPassword2")?.value;
  const errEl = document.getElementById("signupError");
  errEl.textContent = "";
  if(!email || !pw1 || pw1.length<8 || pw1!==pw2){
    errEl.textContent = "이메일/비밀번호(8자↑)/확인을 다시 입력하세요.";
    return;
  }
  try{
    await createUserWithEmailAndPassword(auth, email, pw1);
    signupDialog?.close();
    loginDialog?.close();
    alert("회원가입 완료!");
 }catch(e){ errEl.textContent = e.message || String(e); }
});

// 상태 반영 (우상단 버튼)
onAuthStateChanged(auth, (user)=>{
  if(user){
    if(navUser){ navUser.classList.remove("hidden"); navUser.textContent = user.email ?? user.uid; }
    if(btnOpenLogin){ btnOpenLogin.textContent = "로그아웃"; btnOpenLogin.dataset.state="logout"; }
  }else{
    if(navUser){ navUser.classList.add("hidden"); navUser.textContent = ""; }
    if(btnOpenLogin){ btnOpenLogin.textContent = "로그인"; btnOpenLogin.dataset.state="login"; }
  }
});
