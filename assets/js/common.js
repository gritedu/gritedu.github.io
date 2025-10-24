export function injectCommonUI() {
  const headerTpl = `
  <header class="grit-header fixed">
    <div class="grit-header__wrap">
      <a class="grit-logo" href="./index.html" aria-label="그릿에듀 홈">
        <img src="./assets/logo.png" alt="그릿에듀 로고">
      </a>
      <nav class="grit-nav" aria-label="주 메뉴">
        <ul>
          <li><a href="./index.html">그릿에듀</a></li>
          <li><a href="./story.html">이야기</a></li>
          <li><a href="./instructors.html">강사진</a></li>
          <li><a href="./album.html">갤러리</a></li>
          <li><a href="./contact.html">문의</a></li>
        </ul>
      </nav>
    </div>
  </header>`;
  const footerTpl = `
  <footer class="grit-footer">
    <div class="grit-footer__sns">
      <a href="https://www.instagram.com/grit_edu_seoul/" target="_blank" rel="noopener" aria-label="Instagram" class="sns"><svg width="26" height="26" viewBox="0 0 24 24" fill="#222"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 7.2zM18 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg></a>
      <a href="https://www.youtube.com/@gritedu_official" target="_blank" rel="noopener" aria-label="YouTube" class="sns"><svg width="28" height="28" viewBox="0 0 24 24" fill="#222"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.7 3.5 12 3.5 12 3.5s-7.7 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.7.6 9.4.6 9.4.6s7.7 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.8 15.5V8.5L16 12l-6.2 3.5z"/></svg></a>
      <a href="https://blog.naver.com/PostList.naver?blogId=gritedu&categoryNo=0&from=postList" target="_blank" rel="noopener" aria-label="Naver Blog" class="sns"><svg width="26" height="26" viewBox="0 0 24 24" fill="#222"><path d="M3 3h18v18H3z"/><path fill="#fff" d="M8 7h2.6l3 4.3V7H16v10h-2.6L10.4 12v5H8z"/></svg></a>
    </div>
    <div class="grit-footer__text">
      <p>© 2025 그릿에듀 | 대한민국 교육의 새로운 표준</p>
      <p>[08635] 서울 금천구 시흥대로47길 28-5 남서울교육문화센터 5층<br>Tel : 02-809-0611</p>
    </div>
  </footer>`;

  // 기존 정적 헤더/푸터가 있으면 교체, 없으면 주입
  const existHeader = document.querySelector('.grit-header');
  if (existHeader) { existHeader.outerHTML = headerTpl; } else { document.body.insertAdjacentHTML('afterbegin', headerTpl); }

  const existFooter = document.querySelector('.grit-footer');
  if (existFooter) { existFooter.outerHTML = footerTpl; } else { document.body.insertAdjacentHTML('beforeend', footerTpl); }

  // 현재 페이지 활성 메뉴 표시
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.grit-nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if ((path === '' && href.endsWith('index.html')) || path === href) a.classList.add('is-active');
  });
}
document.addEventListener('DOMContentLoaded', injectCommonUI);
