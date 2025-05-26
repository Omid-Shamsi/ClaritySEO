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
  const navLinks = document.querySelectorAll('.nav-link');
  const tabs = document.querySelectorAll('.tab-content');

  navLinks.forEach(link => {
      link.addEventListener('click', function (e) {
          e.preventDefault();

          // Remove "active" from all links
          navLinks.forEach(link => link.classList.remove('active'));

          // Hide all tabs
          tabs.forEach(tab => tab.style.display = 'none');

          // Activate current link
          this.classList.add('active');

          // Show the corresponding tab
          const targetId = this.getAttribute('data-target');
          const targetTab = document.getElementById(targetId);
          if (targetTab) {
              targetTab.style.display = 'block';
          }
      });
  });     
  // Optional: Show the first tab by default
  tabs.forEach(tab => tab.style.display = 'none');
  const firstTab = document.getElementById("overview-tab");
  if (firstTab) firstTab.style.display = 'block';

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


    document.getElementById("url-indexable").classList.remove('badge-secondary');
    if (message.payload.indexable) {
      document.getElementById("url-indexable").classList.add('badge-success');
      document.getElementById("url-indexable").textContent = "Indexable";
    } else {
      document.getElementById("url-indexable").classList.add('badge-danger');
      document.getElementById("url-indexable").textContent = "Not Indexable";
    }

    document.getElementById("canonical-badge").classList.remove('badge-secondary');
    if (message.payload.url === message.payload.canonical) {
      document.getElementById("canonical-badge").textContent = 'Self-referring'
      document.getElementById("canonical-badge").classList.add('badge-success');
    } else {
      document.getElementById("canonical-badge").textContent = 'Canonicalised'
      document.getElementById("canonical-badge").classList.add('badge-danger');
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


    // Show heading counts
    ["H1", "H2", "H3", "H4", "H5", "H6"].forEach(tag => {
      const countEl = document.getElementById(`${tag.toLowerCase()}-count`);
      if (countEl) {
        countEl.textContent = message.payload.headingCount?.[tag] ?? 0;
      }
    });




    const container = document.getElementById("headings-structure");

    if (container) {
      container.innerHTML = "";

      message.payload.headingTags.forEach(({ tag, content }) => {
        const level = tag[1]; // Get number from "H1", "H2", etc.

        const wrapper = document.createElement("div");
        wrapper.classList.add("heading-item" , `${tag.toLowerCase()}`);
        wrapper.style.marginLeft = `${(parseInt(level) - 1) * 20}px`;

        // Create the <i> element with the correct Font Awesome class
        const icon = document.createElement("i");
        icon.className = `fa-doutone fa-solid fa-${tag.toLowerCase()} list-icon`; // e.g., fa-h1, fa-h2

        // Optional: add spacing or text
        const text = document.createElement("span");
        text.textContent = ` ${content}`;

        // Append the icon and text to wrapper
        wrapper.appendChild(icon);
        wrapper.appendChild(text);

        container.appendChild(wrapper);
      });
    }


    // Content Overview
    if (message.payload.keywords === "No keyword available!") {
      document.getElementById("keywords").classList.add('missing-meta-data');
      document.getElementById("keywords").textContent = "No keyword available!";
    } else {
      document.getElementById("keywords").textContent = message.payload.keywords;
    }


    if (message.payload.wordCount === 0) {
      document.getElementById("wordcount").classList.add('missing-meta-data');
      document.getElementById("wordcount").textContent = "No Content available!";
    } else {
      document.getElementById("wordcount").textContent = message.payload.wordCount;
    }
    
    
    if (message.payload.author === "No author available!") {
      document.getElementById("author").classList.add('missing-meta-data');
      document.getElementById("author").textContent = "No author available!";
    } else {
      document.getElementById("author").textContent = message.payload.author;
    }

    
    // Document Language
    if (message.payload.lang === "No lang available!") {
      document.getElementById("lang").classList.add('missing-meta-data');
    } else {
      document.getElementById("lang").classList.remove('missing-meta-data');
      document.getElementById("lang").textContent = message.payload.lang;
    }


    document.getElementById("total-links").textContent    = message.payload.totalLinks;
    document.getElementById("unique-links").textContent   = message.payload.uniqueLinks;
    document.getElementById("internal-links").textContent = message.payload.internalLinks;
    document.getElementById("external-links").textContent = message.payload.externalLinks;

  

    // inside your chrome.runtime.onMessage listener, after setting link‐count badges…

    // 1) Grab & reset the section
    const linksSection = document.getElementById('links-list-section');
    linksSection.innerHTML = '<h2>Links</h2>';

    // 2) Destructure the two arrays
    const { internalLinksList, externalLinksList } = message.payload;

    // 3) If both are empty, show fallback
    if (
      (!Array.isArray(internalLinksList) || internalLinksList.length === 0) &&
      (!Array.isArray(externalLinksList) || externalLinksList.length === 0)
    ) {
      const p = document.createElement('p');
      p.classList.add('text-muted', 'mt-2');
      p.textContent = 'No links available.';
      linksSection.appendChild(p);
    } else {
      // 4a) Internal Links
      if (internalLinksList.length) {
        const h3 = document.createElement('h3');
        h3.textContent = 'Internal Links';
        h3.classList.add('mt-3');
        linksSection.appendChild(h3);

        const ulInt = document.createElement('ul');
        ulInt.classList.add('list-unstyled');
        internalLinksList.forEach(({ href, anchor }) => {
          const li = document.createElement('li');
          // Plain‐text render: URL — anchor text
          li.textContent = `${href}  —  ${anchor}`;
          ulInt.appendChild(li);
        });
        linksSection.appendChild(ulInt);
      }

      // 4b) External Links
      if (externalLinksList.length) {
        const h3 = document.createElement('h3');
        h3.textContent = 'External Links';
        h3.classList.add('mt-3');
        linksSection.appendChild(h3);

        const ulExt = document.createElement('ul');
        ulExt.classList.add('list-unstyled');
        externalLinksList.forEach(({ href, anchor }) => {
          const li = document.createElement('li');
          // Plain‐text render: URL — anchor text
          li.textContent = `${href}  —  ${anchor}`;
          ulExt.appendChild(li);
        });
        linksSection.appendChild(ulExt);
      }
    }
    // After you've set up everything else in the META_DATA block...

// Wire up the PageSpeed button:
const psiBtn = document.getElementById('pagespeed-button');
if (psiBtn) {
  // First clear any old handlers
  psiBtn.replaceWith(psiBtn.cloneNode(true));
}
const freshPsiBtn = document.getElementById('pagespeed-button');

freshPsiBtn.addEventListener('click', () => {
  const currentUrl = message.payload.url;
  const psiUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(currentUrl)}`;
  // Opens in a new tab
  chrome.tabs.create({ url: psiUrl });
});


  }
});
