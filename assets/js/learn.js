// assets/js/learn.js
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// 페이지 내용은 #learnRoot 안에 있음. 기본은 숨김.
const root = document.getElementById("learnRoot");
root.style.display = "none";

onAuthStateChanged(auth, (user)=>{
  if(!user){
    alert("로그인이 필요합니다.");
    location.href = "/"; // 메인으로
    return;
  }
  // 로그인 완료 → 본문 표시
  const meEmail = document.getElementById("meEmail");
  if(meEmail) meEmail.textContent = user.email || user.uid;
  root.style.display = "block";

  // (예시) 맛보기 영상/강의 세팅…
  const yt = document.getElementById("yt1");
  if(yt && !yt.src) yt.src = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // 임시
});
