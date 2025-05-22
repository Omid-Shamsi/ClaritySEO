// Scripts/script.js

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ['Scripts/content.js']
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "META_DATA") {
    document.getElementById("meta-title").textContent = message.payload.title;
    document.getElementById("meta-description").textContent = message.payload.description;
    document.getElementById("url").textContent = message.payload.url;
    document.getElementById("canonical").textContent = message.payload.canonical;
    if (message.payload.canonical === "No canonical URL available!") {
      document.getElementById("canonical").classList.add('missing-meta-data')
    }


  }
});
