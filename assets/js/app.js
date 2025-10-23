import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCYZXuZ5ZGRgSEzvEGfbaUg6ViiyidSVKU",
  authDomain: "gritedu-lms.firebaseapp.com",
  projectId: "gritedu-lms",
  storageBucket: "gritedu-lms.firebasestorage.app",
  messagingSenderId: "789104307613",
  appId: "1:789104307613:web:0d6acf64a261a1a86d9374"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- 로그인 ---------- */
const loginDialog = document.getElementById("loginDialog");
const btnOpenLogin = document.getElementById("btnOpenLogin");
const btnSignup = document.getElementById("btnSignup");
const doLogin = document.getElementById("doLogin");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const navUser = document.getElementById("navUser");

btnOpenLogin.addEventListener("click", ()=> loginDialog.showModal());
document.querySelectorAll("[data-close]").forEach(b=> b.addEventListener("click", ()=> b.closest("dialog")?.close()));

doLogin.addEventListener("click", async ()=>{
  loginError.textContent = "";
  try{
    await signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPassword.value);
    loginDialog.close();
  }catch(e){
    loginError.textContent = e.message || String(e);
  }
});

onAuthStateChanged(auth, (user)=>{
  if(user){
    navUser.classList.remove("hidden");
    navUser.textContent = user.email ?? user.uid;
    btnOpenLogin.textContent = "로그아웃";
    btnOpenLogin.onclick = ()=> signOut(auth);
  }else{
    navUser.classList.add("hidden");
    navUser.textContent = "";
    btnOpenLogin.textContent = "로그인";
    btnOpenLogin.onclick = ()=> loginDialog.showModal();
  }
});

/* ---------- 회원가입 ---------- */
const signupDialog = document.getElementById("signupDialog");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupPassword2 = document.getElementById("signupPassword2");
const signupError = document.getElementById("signupError");
const doSignup = document.getElementById("doSignup");

btnSignup.addEventListener("click", ()=> signupDialog.showModal());

doSignup.addEventListener("click", async ()=>{
  signupError.textContent = "";
  const email = signupEmail.value.trim();
  const pw1 = signupPassword.value;
  const pw2 = signupPassword2.value;

  if(!email || pw1.length < 8){ signupError.textContent="이메일과 8자 이상 비밀번호를 입력하세요."; return; }
  if(pw1 !== pw2){ signupError.textContent="비밀번호가 일치하지 않습니다."; return; }

  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pw1);
    await setDoc(doc(db, "users", cred.user.uid), {
      email, role: "student", createdAt: serverTimestamp()
    });
    signupDialog.close();
    loginDialog.close?.();
    alert("회원가입 완료! 자동 로그인 되었습니다.");
  }catch(e){
    signupError.textContent = e.message || String(e);
  }
});

/* ---------- 강사진 ---------- */
const instructors = [
  { name:"유홍석", role:"미적/확통/기하", subject:"수학",  photo:"./assets/math_YHS.png" },
  { name:"강지웅", role:"문학·비문학",   subject:"국어",  photo:"./assets/kr_KGW.png" },
  { name:"박혜린", role:"Reading·Listening", subject:"영어", photo:"./assets/eng_PHR.png" },
  { name:"김정연", role:"물리/화학/생지", subject:"과학",  photo:"./assets/si_KJY.jpg" },
  { name:"오지석", role:"지구과학", subject:"과학",  photo:"./assets/si_OJS.png" },
];
const instructorGrid = document.getElementById("instructorGrid");
const subjectTabs = document.getElementById("subjectTabs");

function renderInstructors(subject="ALL"){
  const data = subject==="ALL" ? instructors : instructors.filter(i=>i.subject===subject);
  instructorGrid.innerHTML = data.map(t=>`
    <div class="card">
      <img src="${t.photo}" alt="${t.name}">
      <h3>${t.name}</h3>
      <p>${t.subject} · ${t.role}</p>
    </div>
  `).join("");
}
subjectTabs.addEventListener("click",(e)=>{
  const btn = e.target.closest(".tab");
  if(!btn) return;
  subjectTabs.querySelectorAll(".tab").forEach(t=> t.classList.remove("active"));
  btn.classList.add("active");
  renderInstructors(btn.dataset.subject);
});
renderInstructors();