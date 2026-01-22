// Authentication Management

window.currentUser = null;
window.isAdmin = false;

async function checkSession() {
  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'include'
    });
    const data = await response.json();

    if (data.authenticated) {
      window.currentUser = data.user;
      window.isAdmin = data.user.role === 'admin';
      updateAuthUI();
      if (window.isAdmin) {
        enableAdminFeatures();
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
}

async function login(username, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      window.currentUser = data.user;
      window.isAdmin = data.user.role === 'admin';
      updateAuthUI();
      if (window.isAdmin) {
        enableAdminFeatures();
      }
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Connection error' };
  }
}

async function logout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    window.currentUser = null;
    window.isAdmin = false;
    updateAuthUI();
    disableAdminFeatures();
    location.reload();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');
  const addEventBtn = document.getElementById('addEventBtn');

  if (window.currentUser) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (userName) userName.textContent = window.currentUser.username;
    if (addEventBtn && window.isAdmin) addEventBtn.style.display = 'block';
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
    if (addEventBtn) addEventBtn.style.display = 'none';
  }
}

function showLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('active');
    document.getElementById('username').focus();
  }
}

function hideLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').textContent = '';
  }
}

function initAuth() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginForm = document.getElementById('loginForm');
  const loginModal = document.getElementById('loginModal');

  if (loginBtn) {
    loginBtn.addEventListener('click', showLoginModal);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const errorText = document.getElementById('loginError');

      const result = await login(username, password);

      if (result.success) {
        hideLoginModal();
      } else {
        errorText.textContent = result.error || 'Login failed';
      }
    });
  }

  if (loginModal) {
    const closeBtn = loginModal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideLoginModal);
    }

    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        hideLoginModal();
      }
    });
  }
}

document.addEventListener('siteAccessGranted', () => {
  checkSession();
});

document.addEventListener('DOMContentLoaded', initAuth);
