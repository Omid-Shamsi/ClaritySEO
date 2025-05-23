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

    if (message.payload.canonical === "No canonical URL available!") {
      document.getElementById("canonical").classList.add('missing-meta-data');
    } else {
      document.getElementById("canonical").classList.remove('missing-meta-data');
    }

    if (message.paylaod.title === "No title available!") {
      document.getElementById("meta-title").classList.add('missing-meta-data');
    } else {
      document.getElementById("meta-title").classList.remove('missing-meta-data');
    }

    if (message.paylaod.description === "No description available!") {
      document.getElementById("meta-description").classList.add('missing-meta-data');
    } else {
      document.getElementById("meta-description").classList.remove('missing-meta-data');
    }

  }
});
