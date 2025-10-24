// ---------------------- 햄버거 ----------------------
window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('site-nav');
  if (hamburger && nav && !hamburger.__bound) {
    const toggleNav = () => {
      const opened = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', opened ? 'true' : 'false');
      document.body.classList.toggle('nav-open', opened);
    };
    hamburger.addEventListener('click', toggleNav);
    nav.addEventListener('click', (e)=>{ if (e.target === nav && nav.classList.contains('open')) toggleNav(); });
    window.addEventListener('resize', ()=>{ if (window.innerWidth > 860) { nav.classList.remove('open'); document.body.classList.remove('nav-open'); hamburger.setAttribute('aria-expanded','false'); }});
    hamburger.__bound = true;
  }
});

// ---------------------- Back-to-Top ----------------------
window.addEventListener('DOMContentLoaded', () => {
  const btt = document.getElementById('backToTop');
  if (!btt) return;
  const onScroll = () => btt.style.display = (window.scrollY > 300) ? 'flex' : 'none';
  window.addEventListener('scroll', onScroll, { passive:true });
  btt.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  onScroll();
});