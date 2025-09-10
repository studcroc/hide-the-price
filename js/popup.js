document.addEventListener('DOMContentLoaded', async () => {
  const toggleHide = document.getElementById('toggleBlur'); // ID kept for compatibility
  const statusText = document.getElementById('statusText');
  const statusDiv = document.querySelector('.status');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Get current status from content script
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
    const isActive = response?.active ?? false;
    const siteName = response?.site ?? 'Unknown Site';
    
    toggleHide.checked = isActive;
    updateStatus(isActive, siteName);
  } catch (error) {
    console.log('Content script not ready or not on supported site');
    statusText.textContent = 'Not on a supported e-commerce site';
    statusDiv.className = 'status inactive';
    toggleHide.disabled = true;
    return;
  }

  // Handle toggle changes
  toggleHide.addEventListener('change', async () => {
    const isActive = toggleHide.checked;
    
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'toggleHide' });
      const siteName = response?.site || '';
      updateStatus(isActive, siteName);
    } catch (error) {
      console.error('Failed to toggle hide:', error);
      // Revert toggle state
      toggleHide.checked = !isActive;
    }
  });

  function updateStatus(isActive, siteName = '') {
    const siteInfo = siteName ? ` on ${siteName}` : '';
    
    if (isActive) {
      statusText.textContent = `Prices are hidden${siteInfo}`;
      statusDiv.className = 'status active';
    } else {
      statusText.textContent = `Prices are visible${siteInfo}`;
      statusDiv.className = 'status inactive';
    }
  }
});