import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const btnOpenLogin = document.getElementById("btnOpenLogin");
const navUser      = document.getElementById("navUser");
const loginDialog  = document.getElementById("loginDialog");
const btnHamburger = document.getElementById("btnHamburger");
const mainMenu     = document.getElementById("mainMenu");

/* 햄버거 */
btnHamburger?.addEventListener("click", ()=> mainMenu?.classList.toggle("open"));

/* 모달 닫기 */
document.querySelectorAll("[data-close]")?.forEach(b=>{
  b.addEventListener("click", ()=> b.closest("dialog")?.close());
});

/* 로그인 버튼 */
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

/* 상태 반영 + 이름 표시 */
onAuthStateChanged(auth, async (user)=>{
  if(user){
    let label = user.email ?? user.uid;
    try{
      const snap = await getDoc(doc(db, "users", user.uid));
      const u = snap.exists() ? snap.data() : null;
      if(u?.name) label = u.name;            // ✅ 이름 있으면 사용
    }catch(_){}
    if(navUser){ navUser.classList.remove("hidden"); navUser.textContent = label; }
    if(btnOpenLogin){ btnOpenLogin.textContent = "로그아웃"; btnOpenLogin.dataset.state="logout"; }
  }else{
    navUser?.classList.add("hidden"); if(navUser) navUser.textContent = "";
    if(btnOpenLogin){ btnOpenLogin.textContent = "로그인"; btnOpenLogin.dataset.state="login"; }
  }
});