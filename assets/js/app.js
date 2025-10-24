// 중앙 데이터
import { INSTRUCTORS } from './data.instructors.js';
import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

/* ===== 엔터로 로그인 ===== */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('guestEmail')?.value.trim();
    const password = document.getElementById('guestPassword')?.value;
    const error = document.getElementById('guestError');
    
    if (error) error.textContent = '';
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 성공 시 페이지 새로고침으로 상태 동기화
      location.reload();
    } catch (err) {
      if (error) error.textContent = err.message || String(err);
    }
  });
}

/* ===== 모바일 메뉴 개선 ===== */
function initHamburgerMenu() {
  const btnHamburger = document.getElementById('btnHamburger');
  const mainMenu = document.getElementById('mainMenu');
  
  if (!btnHamburger || !mainMenu) return;
  
  // 햄버거 메뉴 토글
  btnHamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainMenu.classList.contains('open');
    
    if (isOpen) {
      mainMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    } else {
      mainMenu.classList.add('open');
      document.body.classList.add('menu-open');
    }
  });
  
  // 오버레이 클릭 시 메뉴 닫기
  document.addEventListener('click', (e) => {
    if (mainMenu.classList.contains('open') && !mainMenu.contains(e.target) && !btnHamburger.contains(e.target)) {
      mainMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });
  
  // 리사이즈 시 메뉴 닫기
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
      mainMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });
  
  // ESC 키로 메뉴 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainMenu.classList.contains('open')) {
      mainMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
  });
}

// DOM 로딩 완료 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHamburgerMenu);
} else {
  initHamburgerMenu();
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