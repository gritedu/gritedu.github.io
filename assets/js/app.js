// ===== Common Includes =====
async function includePartials() {
  const headerHost = document.querySelector('[data-include="header"]');
  const footerHost = document.querySelector('[data-include="footer"]');
  if (headerHost) {
    const res = await fetch('/assets/components/header.html');
    headerHost.innerHTML = await res.text();
  }
  if (footerHost) {
    const res = await fetch('/assets/components/footer.html');
    footerHost.innerHTML = await res.text();
  }
}

function lockScroll(lock) {
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}

// ===== Drawer & Modal Controls =====
function wireInteractions() {
  const d = document;

  // Drawer
  const drawer = d.getElementById('mobile-drawer');
  const drawerOverlay = d.getElementById('drawer-overlay');
  const btnHamburger = d.getElementById('btn-hamburger');

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('open');
    drawerOverlay?.classList.remove('hidden');
    btnHamburger?.setAttribute('aria-expanded', 'true');
    drawer?.setAttribute('aria-hidden', 'false');
    lockScroll(true);
  };
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawerOverlay?.classList.add('hidden');
    btnHamburger?.setAttribute('aria-expanded', 'false');
    drawer?.setAttribute('aria-hidden', 'true');
    lockScroll(false);
  };

  btnHamburger?.addEventListener('click', openDrawer);
  d.addEventListener('click', (e) => {
    const t = e.target;
    if (t?.dataset?.close === 'drawer' || t?.closest?.('.drawer-close')) closeDrawer();
  });

  // Login Modal (UI only)
  const loginModal = d.getElementById('login-modal');
  const loginOverlay = d.getElementById('login-overlay');
  const btnLogin = d.getElementById('btn-login');

  const openLogin = () => {
    loginModal?.classList.remove('hidden');
    loginOverlay?.classList.remove('hidden');
    lockScroll(true);
  };
  const closeLogin = () => {
    loginModal?.classList.add('hidden');
    loginOverlay?.classList.add('hidden');
    lockScroll(false);
  };

  d.addEventListener('click', (e) => {
    const t = e.target;
    if (t?.dataset?.open === 'login') openLogin();
    if (t?.dataset?.close === 'login' || t?.closest?.('.modal-close')) closeLogin();
  });
  d.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeLogin();
    }
  });

  // Prevent default submit (Firebase later)
  d.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: Firebase Auth attach later
    alert('현재는 UI만 동작합니다. Firebase 연동은 이후 단계에서 진행합니다.');
  });
}

// ===== Boot =====
(async function boot() {
  await includePartials();
  wireInteractions();
})();