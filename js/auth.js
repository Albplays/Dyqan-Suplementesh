/* PowerFit Supplements — Auth State Manager */
(function () {
  const onServer = location.protocol === 'http:' || location.protocol === 'https:';

  async function checkAuth() {
    const navAuth    = document.getElementById('nav-auth');
    const mobileAuth = document.getElementById('mobile-auth-link');
    if (!navAuth) return;

    if (!onServer) {
      renderLoginBtn(navAuth, mobileAuth);
      return;
    }

    try {
      const res  = await fetch('php/auth-check.php', { credentials: 'same-origin' });
      const data = await res.json();
      if (data.logged_in) {
        renderUserBar(navAuth, mobileAuth, data.user);
      } else {
        renderLoginBtn(navAuth, mobileAuth);
      }
    } catch {
      renderLoginBtn(navAuth, mobileAuth);
    }
  }

  function renderLoginBtn(navEl, mobileEl) {
    navEl.innerHTML = `<a href="login.html" class="btn btn-outline btn-sm">Hyr</a>`;
    if (mobileEl) {
      mobileEl.textContent = 'Hyr / Regjistrohu';
      mobileEl.href = 'login.html';
      mobileEl.style.color  = '';
      mobileEl.style.cursor = '';
    }
  }

  function renderUserBar(navEl, mobileEl, user) {
    const initial   = user.name.charAt(0).toUpperCase();
    const firstName = user.name.split(' ')[0];

    navEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <a href="dashboard.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;padding:6px 10px 6px 8px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg-3);transition:var(--t);" onmouseover="this.style.borderColor='var(--orange)'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="width:28px;height:28px;border-radius:50%;background:var(--orange);color:#0a0a0a;font-size:0.78rem;font-weight:800;display:flex;align-items:center;justify-content:center;font-family:var(--font-condensed);flex-shrink:0;">${initial}</div>
          <span style="font-size:0.85rem;font-weight:600;color:var(--text);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${firstName}</span>
        </a>
        <button id="auth-logout-btn" style="padding:6px 12px;font-family:var(--font-condensed);font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:1px solid #555;background:none;color:#888;border-radius:3px;cursor:pointer;transition:all 0.25s;">Dil</button>
      </div>`;

    document.getElementById('auth-logout-btn').addEventListener('mouseenter', function () {
      this.style.borderColor = 'var(--danger)';
      this.style.color = 'var(--danger)';
    });
    document.getElementById('auth-logout-btn').addEventListener('mouseleave', function () {
      this.style.borderColor = '#555';
      this.style.color = '#888';
    });
    document.getElementById('auth-logout-btn').addEventListener('click', logout);

    if (mobileEl) {
      mobileEl.textContent = `${firstName} · Dashboard`;
      mobileEl.href = 'dashboard.html';
      mobileEl.style.color  = 'var(--orange)';
      mobileEl.style.cursor = 'pointer';
    }
  }

  async function logout() {
    try {
      await fetch('php/logout.php', { method: 'POST', credentials: 'same-origin' });
    } catch { }
    window.location.reload();
  }

  document.addEventListener('DOMContentLoaded', checkAuth);
})();
