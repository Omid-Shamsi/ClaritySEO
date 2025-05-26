// Scripts/content.js

(() => {
    const getMetaContent = (selector, fallback) => {
        const el = document.querySelector(selector);
        return el && el.content?.trim() ? el.content.trim() : fallback;
    };

    // Meta fields
    const metaTitle       = document.title.trim() || "No title available!";
    const metaDescription = getMetaContent("meta[name='description']", "No description available!");
    const canonical       = document.querySelector("link[rel='canonical']")?.href?.trim() || "No canonical URL available!";
    const url             = window.location.href || "No URL available!";
    const robotsMeta      = getMetaContent("meta[name='robots']", "");
    const isIndexable     = !/noindex/i.test(robotsMeta);
    const keywords        = getMetaContent("meta[name='keywords']", "No keyword available!");
    const author          = getMetaContent("meta[name='author']", "No author available!");
    
    // Page language
    const lang = document.documentElement.getAttribute('lang')?.trim() || "No lang available!";

    // Headings
    const headingTagsRaw = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const headingTags    = headingTagsRaw.map(h => ({
        tag:     h.tagName,
        content: h.textContent.trim()
    }));
    const headingOrder = headingTags.map(h => h.tag);
    const headingCount = headingTags.reduce((acc, h) => {
        acc[h.tag] = (acc[h.tag] || 0) + 1;
        return acc;
    }, { H1: 0, H2: 0, H3: 0, H4: 0, H5: 0, H6: 0 });

    // Word count
    const bodyText = document.body.innerText || "";
    const wordCount = bodyText
        .trim()
        .split(/\s+/)
        .filter(w => w.length > 0)
        .length;

    // Link counts and lists
    const anchors       = Array.from(document.querySelectorAll('a[href]'));
    const hrefs         = anchors.map(a => a.href);
    const origin        = location.origin;

    const totalLinks    = hrefs.length;
    const uniqueLinks   = new Set(hrefs).size;
    const internalCount = hrefs.filter(h => h.startsWith(origin)).length;
    const externalCount = hrefs.filter(h => /^https?:\/\//.test(h) && !h.startsWith(origin)).length;

    const internalLinksList = anchors
        .filter(a => a.href.startsWith(origin))
        .map(a => ({ href: a.href, anchor: a.textContent.trim() || a.href }));

    const externalLinksList = anchors
        .filter(a => /^https?:\/\//.test(a.href) && !a.href.startsWith(origin))
        .map(a => ({ href: a.href, anchor: a.textContent.trim() || a.href }));

    // Send everything back to popup
    chrome.runtime.sendMessage({
        type: "META_DATA",
        payload: {
            title:               metaTitle,
            description:         metaDescription,
            canonical:           canonical,
            url:                 url,
            indexable:           isIndexable,
            keywords:            keywords,
            author:              author,
            lang:                lang,
            headingTags:         headingTags,
            headingOrder:        headingOrder,
            headingCount:        headingCount,
            wordCount:           wordCount,
            totalLinks:          totalLinks,
            uniqueLinks:         uniqueLinks,
            internalLinks:       internalCount,
            externalLinks:       externalCount,
            internalLinksList:   internalLinksList,
            externalLinksList:   externalLinksList
        }
    });
})();
