// 중앙 데이터
import { INSTRUCTORS } from './data.instructors.js';

/* ===== 모바일 메뉴 (있을 때만 동작) ===== */
const btnHamburger = document.getElementById('btnHamburger');
const mainMenu = document.getElementById('mainMenu');
if (btnHamburger && mainMenu){
  btnHamburger.addEventListener('click', ()=> mainMenu.classList.toggle('open'));
}

/* ===== 강사진 렌더 (년도 표시 제거) ===== */
const instructorGrid = document.getElementById("instructorGrid");
const subjectTabs = document.getElementById("subjectTabs");

function renderInstructors(subject="ALL"){
  if(!instructorGrid) return;
  const data = subject==="ALL" ? INSTRUCTORS : INSTRUCTORS.filter(i=>i.subject===subject);
  instructorGrid.innerHTML = data.map(t=>`
    <a class="card" href="/instructors.html?id=${t.id}">
      <img src="${t.photo}" alt="${t.name}">
      <h3>${t.name} 선생님</h3>
      <p>${t.subject}</p>   <!-- ✅ 년도 표기 제거 -->
    </a>
  `).join("");
}
if(subjectTabs){
  subjectTabs.addEventListener("click",(e)=>{
    const btn = e.target.closest(".tab");
    if(!btn) return;
    subjectTabs.querySelectorAll(".tab").forEach(t=> t.classList.remove("active"));
    btn.classList.add("active");
    renderInstructors(btn.dataset.subject);
  });
}
renderInstructors();

/* ===== 로그인/회원가입 모달 (있을 때만 동작) ===== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYZXuZ5ZGRgSEzvEGfbaUg6ViiyidSVKU",
  authDomain: "gritedu-lms.firebaseapp.com",
  projectId: "gritedu-lms",
  storageBucket: "gritedu-lms.firebasestorage.app",
  messagingSenderId: "789104307613",
  appId: "1:789104307613:web:0d6acf64a261a1a86d9374"
};
initializeApp(firebaseConfig);
const auth = getAuth();

// 요소 존재 체크
const loginDialog = document.getElementById("loginDialog");
const signupDialog = document.getElementById("signupDialog");
const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnSignup = document.getElementById("btnSignup");
const doLogin = document.getElementById("doLogin");
const doSignup = document.getElementById("doSignup");

if (btnOpenLogin && loginDialog){
  btnOpenLogin.addEventListener("click", ()=> loginDialog.showModal());
}
document.querySelectorAll("[data-close]")?.forEach(b=>{
  b.addEventListener("click", ()=> b.closest("dialog")?.close());
});

if (btnSignup && signupDialog){
  btnSignup.addEventListener("click", ()=> signupDialog.showModal());
}

if (doLogin){
  const email = document.getElementById("loginEmail");
  const pw = document.getElementById("loginPassword");
  const err = document.getElementById("loginError");
  doLogin.addEventListener("click", async ()=>{
    err.textContent = "";
    try{
      await signInWithEmailAndPassword(auth, (email?.value||"").trim(), pw?.value||"");
      loginDialog?.close();
    }catch(e){ err.textContent = e.message || String(e); }
  });
}

if (doSignup){
  const email = document.getElementById("signupEmail");
  const pw1 = document.getElementById("signupPassword");
  const pw2 = document.getElementById("signupPassword2");
  const err = document.getElementById("signupError");
  doSignup.addEventListener("click", async ()=>{
    err.textContent = "";
    if(!email?.value || (pw1?.value||"").length<8 || pw1.value!==pw2?.value){
      err.textContent = "이메일 및 8자 이상 비밀번호/확인을 입력하세요.";
      return;
    }
    try{
      await createUserWithEmailAndPassword(auth, email.value.trim(), pw1.value);
      signupDialog?.close();
      loginDialog?.close();
      alert("회원가입 완료!");
    }catch(e){ err.textContent = e.message || String(e); }
  });
}

// 우상단 '로그인' 버튼 텍스트 상태
const navUser = document.getElementById("navUser");
onAuthStateChanged(auth, (user)=>{
  if(!btnOpenLogin) return;
  if(user){
    navUser?.classList?.remove("hidden");
    if(navUser) navUser.textContent = user.email ?? user.uid;
    btnOpenLogin.textContent = "로그아웃";
    btnOpenLogin.onclick = ()=> signOut(auth);
  }else{
    navUser?.classList?.add("hidden");
    if(navUser) navUser.textContent = "";
    btnOpenLogin.textContent = "로그인";
    btnOpenLogin.onclick = ()=> loginDialog?.showModal();
  }
});