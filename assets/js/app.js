const instructors = [
  { name:"유홍석", subject:"수학", year:"2025", photo:"./assets/instructors/math_YHS.png" },
  { name:"강지웅", subject:"국어", year:"2025", photo:"./assets/instructors/kr_KGW.png" },
  { name:"금보혜", subject:"수학", year:"2025", photo:"./assets/instructors/math_GBH.png" },
  { name:"김정연", subject:"과학", year:"2025", photo:"./assets/instructors/si_KJY.jpg" },
  { name:"박나린", subject:"수학", year:"2025", photo:"./assets/instructors/math_PNR.jpg" },
  { name:"박소진", subject:"국어", year:"2025", photo:"./assets/instructors/kr_PSJ.png" },
  { name:"박혜린", subject:"영어", year:"2025", photo:"./assets/instructors/eng_PHR.png" },
  { name:"송윤지", subject:"수학", year:"2025", photo:"./assets/instructors/math_SYJ.png" },
  { name:"오준석", subject:"과학", year:"2025", photo:"./assets/instructors/si_OJS.png" },
  { name:"오혜빈", subject:"영어", year:"2025", photo:"./assets/instructors/eng_OHB.png" },
  { name:"이유진", subject:"수학", year:"2025", photo:"./assets/instructors/math_LYJ.jpg" },
  { name:"이관우", subject:"수학", year:"2025", photo:"./assets/instructors/math_LGW.png" },
  { name:"조경희", subject:"수학", year:"2025", photo:"./assets/instructors/math_JKH.jpg" },
  { name:"조봉현", subject:"영어", year:"2025", photo:"./assets/instructors/eng_JBH.png" },
  { name:"최재영", subject:"수학", year:"2025", photo:"./assets/instructors/math_CJY.png" },
  { name:"허정행", subject:"수학", year:"2025", photo:"./assets/instructors/math_HJH.jpg" },
  { name:"최은지", subject:"컨설팅", year:"2025", photo:"./assets/instructors/con_CEJ.png" },
];

const instructorGrid = document.getElementById("instructorGrid");
const subjectTabs = document.getElementById("subjectTabs");

function renderInstructors(subject="ALL") {
  if(!instructorGrid) return;
  const data = subject==="ALL" ? instructors : instructors.filter(i=>i.subject===subject);
  instructorGrid.innerHTML = data.map(t=>`
    <div class="card">
      <img src="${t.photo}" alt="${t.name}">
      <h3>${t.name} 선생님</h3>
      <p>${t.subject} · ${t.year}</p>
    </div>
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