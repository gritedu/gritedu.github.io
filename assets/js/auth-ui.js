// assets/js/auth-ui.js
import { auth } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const btnOpenLogin = document.getElementById("btnOpenLogin");
const navUser      = document.getElementById("navUser");
const loginDialog  = document.getElementById("loginDialog");

document.querySelectorAll("[data-close]")?.forEach(b=>{
  b.addEventListener("click", ()=> b.closest("dialog")?.close());
});

btnOpenLogin?.addEventListener("click", ()=>{
  if(btnOpenLogin.dataset.state==="logout") signOut(auth);
  else loginDialog?.showModal();
});

document.getElementById("doLogin")?.addEventListener("click", async ()=>{
  const email = document.getElementById("loginEmail")?.value.trim();
  const pw    = document.getElementById("loginPassword")?.value;
  const err   = document.getElementById("loginError");
  err.textContent = "";
  try{
    await signInWithEmailAndPassword(auth, email, pw);
    loginDialog?.close();
  }catch(e){ err.textContent = e.message || String(e); }
});

onAuthStateChanged(auth, (user)=>{
  if(user){
    navUser?.classList.remove("hidden");
    if(navUser) navUser.textContent = user.email ?? user.uid;
    if(btnOpenLogin){ btnOpenLogin.textContent="로그아웃"; btnOpenLogin.dataset.state="logout"; }
  }else{
    navUser?.classList.add("hidden");
    if(navUser) navUser.textContent = "";
    if(btnOpenLogin){ btnOpenLogin.textContent="로그인"; btnOpenLogin.dataset.state="login"; }
  }
});