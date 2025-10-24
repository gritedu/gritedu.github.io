// assets/js/learn.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const root = document.getElementById("learnRoot");   // 본문 래퍼
const list = document.getElementById("courseList");  // 강좌 카드가 붙을 곳
const meEmail = document.getElementById("meEmail");

root.style.display = "none";
list.innerHTML = `<p class="muted">로딩 중…</p>`;

onAuthStateChanged(auth, async (user)=>{
  if(!user){
    alert("로그인이 필요합니다.");
    location.href = "/"; return;
  }

  // 이름 표시
  let label = user.email || user.uid;
  try{
    const snap = await getDoc(doc(db, "users", user.uid));
    if(snap.exists() && snap.data().name) label = snap.data().name; // ✅
  }catch(_){}
  if(meEmail) meEmail.textContent = label;

  // 승인 여부/수강 강좌 조회
  const uref = doc(db, "users", user.uid);
  const usnap = await getDoc(uref);
  if(!usnap.exists()){
    list.innerHTML = `<div class="card-soft">승인 대기 중입니다. (관리자에게 문의)</div>`;
    root.style.display = "block"; return;
  }
  const u = usnap.data();
  if(u.active !== true){
    list.innerHTML = `<div class="card-soft">승인 대기 중입니다. (관리자에게 문의)</div>`;
    root.style.display = "block"; return;
  }

  const courses = Array.isArray(u.courses) ? u.courses : [];
  if(courses.length === 0){
    list.innerHTML = `<div class="card-soft">수강 중인 강좌가 없습니다.</div>`;
    root.style.display = "block"; return;
  }

  // 각 강좌 문서 로드 후 카드 렌더
  const cards = [];
  for(const id of courses){
    const csnap = await getDoc(doc(db, "courses", id));
    if(!csnap.exists()) continue;
    const c = csnap.data();

    // YouTube embed
    const ytSrc = c.yt ? `https://www.youtube.com/embed/${c.yt}` : "";

    cards.push(`
      <article class="course-card">
        <header>
          <div>
            <h3>${c.title} <small class="muted">${c.teacher}</small></h3>
            <div class="tags"><span>${c.subject||""}</span><span>${id}</span></div>
          </div>
        </header>
        <div class="course-body">
          <div class="ytwrap">
            ${ytSrc ? `<iframe src="${ytSrc}" allowfullscreen loading="lazy" title="${c.title}"></iframe>` : `<div class="muted" style="padding:12px">영상 준비중</div>`}
          </div>
          <div class="course-side">
            <h4>공지</h4>
            <ul class="weeks">
              ${(c.notice||[]).map(n=>`<li>${n}</li>`).join("") || "<li>공지 없음</li>"}
            </ul>
          </div>
        </div>
      </article>
    `);
  }

  list.innerHTML = cards.join("") || `<div class="card-soft">표시할 강좌가 없습니다.</div>`;
  root.style.display = "block";
});