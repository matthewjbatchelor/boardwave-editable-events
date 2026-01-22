// Site Access Control - No password required, handles routing

function initSiteAccess() {
  const overlay = document.getElementById('sitePasswordOverlay');

  // Hide the password overlay - no longer needed
  if (overlay) {
    overlay.classList.add('hidden');
  }

  // Dispatch event to signal access is granted
  document.dispatchEvent(new Event('siteAccessGranted'));
}

document.addEventListener('DOMContentLoaded', initSiteAccess);
