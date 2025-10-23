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