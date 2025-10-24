// assets/js/auth-ui.js
import { auth } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

// 허용 UID 화이트리스트
const ALLOWED_UIDS = new Set(["BvPNaPre9yaFjMV0ISNIDHAnwfS2"]); // 요청하신 UID

// DOM 헬퍼
const $ = (s) => document.querySelector(s);
const headerEmail = $("#headerEmail");
const loginBtn    = $("#loginBtn");
const logoutBtn   = $("#logoutBtn");
const menuLearn   = $("#menuLearn");
const loginDlg    = $("#loginDialog");
const loginForm   = $("#loginForm");
const emailInput  = $("#loginEmail");
const passInput   = $("#loginPassword");

// 상태 → UI 반영
function syncUI(user){
  const loggedIn = !!user && ALLOWED_UIDS.has(user.uid);
  if (loginBtn)  loginBtn.style.display  = loggedIn ? "none" : "inline-flex";
  if (logoutBtn) logoutBtn.style.display = loggedIn ? "inline-flex" : "none";
  if (menuLearn) menuLearn.style.display = loggedIn ? "" : "none";

  if (headerEmail){
    if (loggedIn && user.email){
      // 이메일 → 아이디만 + "님"
      headerEmail.textContent = `${user.email.split("@")[0]} 님`;
      headerEmail.hidden = false;
    } else {
      headerEmail.hidden = true;
      headerEmail.textContent = "";
    }
  }
}

// 로그인 폼 submit
if (loginForm && !loginForm.__bound){
  loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    try{
      const email = emailInput.value.trim();
      const pw    = passInput.value;
      const cred  = await signInWithEmailAndPassword(auth, email, pw);

      // UID 화이트리스트 체크
      if (!ALLOWED_UIDS.has(cred.user.uid)){
        await signOut(auth);
        alert("허용되지 않은 계정입니다. 관리자에게 문의하세요.");
        return;
      }

      // 성공
      if (loginDlg?.close) loginDlg.close();
      // 필요하면 자동 이동: location.href = "./learn.html";
    }catch(err){
      alert("로그인에 실패했습니다. 이메일/비밀번호를 확인하세요.");
      console.error(err);
    }
  });
  loginForm.__bound = true;
}

// 버튼 핸들러
if (loginBtn && !loginBtn.__bound){
  loginBtn.addEventListener("click", (e)=>{ e.preventDefault(); loginDlg?.showModal?.(); });
  loginBtn.__bound = true;
}
if (logoutBtn && !logoutBtn.__bound){
  logoutBtn.addEventListener("click", async (e)=>{
    e.preventDefault();
    await signOut(auth);
    if (location.pathname.endsWith("learn.html")) location.href = "/";
  });
  logoutBtn.__bound = true;
}

// 전역 인증 상태 구독
onAuthStateChanged(auth, (user)=>{
  // 허용되지 않은 UID가 로그인되면 즉시 차단
  if (user && !ALLOWED_UIDS.has(user.uid)){
    signOut(auth);
    return;
  }
  syncUI(user);
  // learn.html에서 뷰 전환
  if (location.pathname.endsWith("learn.html")){
    const guest  = document.querySelector(".guest-view");
    const member = document.querySelector(".member-view");
    const nameEl = document.getElementById("memberName");
    const ok = !!user && ALLOWED_UIDS.has(user?.uid);
    if (guest && member){
      guest.hidden = ok;
      member.hidden = !ok;
      if (ok && nameEl && user?.email) nameEl.textContent = user.email.split("@")[0];
    }
  }
});