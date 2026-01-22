// Site Password Access Control

async function checkSiteAccess() {
  try {
    const response = await fetch('/api/site/check-access');
    const data = await response.json();
    return data.hasAccess;
  } catch (error) {
    console.error('Error checking site access:', error);
    return false;
  }
}

async function verifySitePassword(password) {
  try {
    const response = await fetch('/api/site/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('Error verifying site password:', error);
    return { success: false, error: 'Connection error' };
  }
}

function initSiteAccess() {
  const overlay = document.getElementById('sitePasswordOverlay');
  const form = document.getElementById('sitePasswordForm');
  const errorText = document.getElementById('sitePasswordError');
  const passwordInput = document.getElementById('sitePassword');

  if (!overlay || !form) return;

  // Check if already has access
  checkSiteAccess().then(hasAccess => {
    if (hasAccess) {
      overlay.classList.add('hidden');
      document.dispatchEvent(new Event('siteAccessGranted'));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorText.textContent = '';

    const password = passwordInput.value;
    const result = await verifySitePassword(password);

    if (result.success) {
      overlay.classList.add('hidden');
      document.dispatchEvent(new Event('siteAccessGranted'));
    } else {
      errorText.textContent = result.error || 'Invalid password';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
}

document.addEventListener('DOMContentLoaded', initSiteAccess);
