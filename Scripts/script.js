// Scripts/script.js

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];

  if (!tab || !tab.url || !(tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    // Not a normal webpage URL, so don't inject the content script
    console.log('Skipping script injection on non-web page:', tab?.url);
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['Scripts/content.js']
  }).catch(err => {
    console.error('Failed to inject script:', err);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "META_DATA") {
    document.getElementById("meta-title").textContent = message.payload.title;
    document.getElementById("meta-description").textContent = message.payload.description;
    document.getElementById("url").textContent = message.payload.url;
    document.getElementById("canonical").textContent = message.payload.canonical;

    // Fixing Badges
    document.getElementById("meta-title-badge").textContent = `${message.payload.title.length} Characters`;
    document.getElementById("meta-title-badge").classList.remove('badge-secondary');
    if (message.payload.title.length >= 50 && message.payload.title.length <= 60) {
      document.getElementById("meta-title-badge").classList.add('badge-success');
    } else {
      document.getElementById("meta-title-badge").classList.add('badge-danger');
    }


    document.getElementById("meta-description-badge").textContent = `${message.payload.description.length} Characters`;
    document.getElementById("meta-description-badge").classList.remove('badge-secondary');
    if (message.payload.description.length >= 155 && message.payload.description.length <= 160) {
      document.getElementById("meta-description-badge").classList.add('badge-success');
    } else {
      document.getElementById("meta-description-badge").classList.add('badge-danger');
    }


    const urlPath = new URL(message.payload.url).pathname.split('/').filter(Boolean);
    document.getElementById("url-badge-folders").textContent = `${urlPath.length} Folders`;
    document.getElementById("url-badge-folders").classList.remove('badge-secondary');
    if (urlPath.length <= 4) {
      document.getElementById("url-badge-folders").classList.add('badge-success');
    } else {
      document.getElementById("url-badge-folders").classList.add('badge-danger');
    }

    document.getElementById("url-badge").textContent = `${message.payload.url.length} Characters`;
    document.getElementById("url-badge").classList.remove('badge-secondary');
    if (message.payload.url.length <= 60) {
      document.getElementById("url-badge").classList.add('badge-success');
    } else {
      document.getElementById("url-badge").classList.add('badge-warning');
    }

    // Empty Meta Data Handling
    if (message.payload.canonical === "No canonical URL available!") {
      document.getElementById("canonical").classList.add('missing-meta-data');
      document.getElementById("canonical-badge").classList.add('invisible');
    } else {
      document.getElementById("canonical").classList.remove('missing-meta-data');
    }
    
    if (message.payload.title === "No title available!") {
      document.getElementById("meta-title").classList.add('missing-meta-data');
      document.getElementById("meta-title-badge").classList.add('invisible');
    } else {
      document.getElementById("meta-title").classList.remove('missing-meta-data');
      document.getElementById("meta-title-badge").classList.remove('invisible');
    }
    
    if (message.payload.description === "No description available!") {
      document.getElementById("meta-description").classList.add('missing-meta-data');
      document.getElementById("meta-description-badge").classList.add('invisible');
    } else {
      document.getElementById("meta-description").classList.remove('missing-meta-data');
      document.getElementById("meta-description-badge").classList.remove('invisible');
    }
  }
});
