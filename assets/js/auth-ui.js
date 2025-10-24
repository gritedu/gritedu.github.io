// Firebase Auth 연동은 이후 단계에서 진행
// import { auth } from "./firebase.js";
// import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

// const ALLOWED_UIDS = new Set(["BvPNaPre9yaFjMV0ISNIDHAnwfS2"]);

// const $ = (s) => document.querySelector(s);
// const headerEmail = $("#headerEmail");
// const loginBtn    = $("#loginBtn");
// const logoutBtn   = $("#logoutBtn");
// const menuLearn   = $("#menuLearn");
// const loginDlg    = $("#loginDialog");
// const loginForm   = $("#loginForm");
// const emailInput  = $("#loginEmail");
// const passInput   = $("#loginPassword");

// // UI 반영
// function syncUI(user) {
//   const ok = !!user && ALLOWED_UIDS.has(user.uid);
//   if (loginBtn)  loginBtn.style.display  = ok ? "none" : "inline-flex";
//   if (logoutBtn) logoutBtn.style.display = ok ? "inline-flex" : "none";
//   if (menuLearn) menuLearn.style.display = ok ? "" : "none";

//   if (headerEmail){
//     if (ok && user.email){
//       headerEmail.textContent = `${user.email.split("@")[0]} 님`;
//       headerEmail.hidden = false;
//     } else {
//       headerEmail.hidden = true;
//       headerEmail.textContent = "";
//     }
//   }
// }

// // 모달 열기/닫기/로그인
// if (loginBtn && !loginBtn.__bound){
//   loginBtn.addEventListener('click', (e)=>{ e.preventDefault(); loginDlg?.showModal?.(); });
//   loginBtn.__bound = true;
// }
// if (logoutBtn && !logoutBtn.__bound){
//   logoutBtn.addEventListener('click', async (e)=>{ e.preventDefault(); await signOut(auth); if (location.pathname.endsWith('learn.html')) location.href = '/'; });
//   logoutBtn.__bound = true;
// }
// if (loginForm && !loginForm.__bound){
//   loginForm.addEventListener('submit', async (e)=>{
//     e.preventDefault();
//     try {
//       const email = emailInput.value.trim();
//       const pw    = passInput.value;
//       const cred  = await signInWithEmailAndPassword(auth, email, pw);
//       if (!ALLOWED_UIDS.has(cred.user.uid)){
//         await signOut(auth);
//         alert("허용되지 않은 계정입니다. 관리자에게 문의하세요.");
//         return;
//       }
//       loginDlg?.close?.();
//       // 필요 시 자동 이동: location.href = './learn.html';
//     } catch (err) {
//       alert("로그인 실패: 이메일/비밀번호를 확인하세요.");
//       console.error(err);
//     }
//   });
//   loginForm.__bound = true;
// }

// // 상태 구독
// onAuthStateChanged(auth, (user)=>{
//   if (user && !ALLOWED_UIDS.has(user.uid)){
//     signOut(auth);
//     return;
//   }
//   syncUI(user);

//   // learn.html 전환
//   if (location.pathname.endsWith('learn.html')){
//     const guest  = document.querySelector('.guest-view');
//     const member = document.querySelector('.member-view');
//     const nameEl = document.getElementById('memberName');
//     const ok = !!user && ALLOWED_UIDS.has(user?.uid);
//     if (guest && member){
//       guest.hidden = ok;
//       member.hidden = !ok;
//       if (ok && nameEl && user?.email) nameEl.textContent = user.email.split('@')[0];
//     }
//   }
// });

// 현재는 UI만 동작합니다. Firebase 연동은 이후 단계에서 진행합니다.
console.log('Auth UI: Firebase 연동 비활성화됨 (UI만 동작)');