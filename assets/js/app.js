import { INSTRUCTORS } from './data.instructors.js';

// Mobile menu toggle
const btnHamburger = document.getElementById('btnHamburger');
const mainMenu = document.getElementById('mainMenu');
if (btnHamburger && mainMenu){
  btnHamburger.addEventListener('click', ()=> mainMenu.classList.toggle('open'));
}

const instructorGrid = document.getElementById("instructorGrid");
const subjectTabs = document.getElementById("subjectTabs");

function renderInstructors(subject="ALL") {
  if(!instructorGrid) return;
  const data = subject==="ALL" ? INSTRUCTORS : INSTRUCTORS.filter(i=>i.subject===subject);
  instructorGrid.innerHTML = data.map(t=>`
    <a class="card" href="/instructor.html?id=${t.id}">
      <img src="${t.photo}" alt="${t.name}">
      <h3>${t.name} 선생님</h3>
      <p>${t.subject} · ${t.year}</p>
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