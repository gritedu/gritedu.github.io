const HEADER_HEIGHT = 64;

export function injectCommonUI() {
  const headerTpl = `
  <header class="grit-header fixed" style="height:${HEADER_HEIGHT}px">
    <div class="grit-header__wrap" style="height:${HEADER_HEIGHT}px">
      <a class="grit-logo" href="./" aria-label="그릿에듀 홈">
        <img src="./assets/logo.png" alt="그릿에듀" class="grit-logo">
      </a>
      <nav class="grit-nav" aria-label="주 메뉴">
        <ul>
          <li><a href="./">그릿에듀</a></li>
          <li><a href="./story.html">이야기</a></li>
          <li><a href="./instructors.html">강사진</a></li>
          <li><a href="./gallery.html">갤러리</a></li>
          <li><a href="./contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>`;

  const footerTpl = `
  <footer class="grit-footer">
    <div class="grit-footer-inner">
      <div class="grit-footer-sns">
        <a href="https://www.instagram.com/grit_edu_seoul/" target="_blank" rel="noopener" aria-label="Instagram" class="sns">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"></path>
            <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" fill="#fff"></path>
            <circle cx="18" cy="6.5" r="1"></circle>
          </svg>
        </a>
        <a href="https://www.youtube.com/@gritedu_official" target="_blank" rel="noopener" aria-label="YouTube" class="sns">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.7 3.5 12 3.5 12 3.5s-7.7 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.7.6 9.4.6 9.4.6s7.7 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8Z"></path>
            <path d="M9.8 15.5V8.5L16 12l-6.2 3.5Z" fill="#fff"></path>
          </svg>
        </a>
        <a href="https://blog.naver.com/PostList.naver?blogId=gritedu&categoryNo=0&from=postList" target="_blank" rel="noopener" aria-label="Naver Blog" class="sns">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M8 7h2.6l3 4.3V7H16v10h-2.6L10.4 12v5H8Z" fill="#fff"></path>
          </svg>
        </a>
      </div>
      <p>© 2025 그릿에듀 | 서울 금천구 시흥대로47길 28-5 남서울교육문화센터 5층</p>
      <p>Tel : 02-809-0611</p>
    </div>
  </footer>`;

  // 1) 기존 헤더/푸터 있으면 교체, 없으면 주입
  const existHeader = document.querySelector('.grit-header');
  if (existHeader) existHeader.outerHTML = headerTpl; else document.body.insertAdjacentHTML('afterbegin', headerTpl);

  // 2) 고정 높이를 위한 스페이서(한 번만)
  if (!document.querySelector('.grit-header-spacer')) {
    const spacer = document.createElement('div');
    spacer.className = 'grit-header-spacer';
    spacer.style.height = HEADER_HEIGHT + 'px';
    document.body.insertBefore(spacer, document.body.firstElementChild.nextElementSibling);
  }

  const existFooter = document.querySelector('.grit-footer');
  if (existFooter) existFooter.outerHTML = footerTpl; else document.body.insertAdjacentHTML('beforeend', footerTpl);

  // 3) 현재 페이지 활성 메뉴
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.grit-nav a').forEach(a=>{
    if (a.getAttribute('href').endsWith(page)) a.classList.add('is-active');
  });

  // 4) 맨위로 버튼 추가
  if (!document.getElementById('goTop')) {
    const topBtn = document.createElement('button');
    topBtn.id = 'goTop';
    topBtn.className = 'grit-top';
    topBtn.innerHTML = '▲';
    topBtn.setAttribute('aria-label', '맨 위로');
    topBtn.style.opacity = '0';
    document.body.appendChild(topBtn);

    // 맨위로 버튼 동작
    window.addEventListener('scroll', () => {
      topBtn.style.opacity = window.scrollY > 300 ? '1' : '0';
    });
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', injectCommonUI);
