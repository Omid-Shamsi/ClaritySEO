(() => {
    const getMetaContent = (selector, fallback) => {
        const el = document.querySelector(selector);
        return el && el.content?.trim() ? el.content.trim() : fallback;
    };

    const metaTitle = document.title.trim() || "No title available!";
    const metaDescription = getMetaContent("meta[name='description']", "No description available!");
    const canonical = document.querySelector("link[rel='canonical']")?.href?.trim() || "No canonical URL available!";
    const url = window.location.href || "No URL available!";
    const robotsMeta = getMetaContent("meta[name='robots']", "");
    const isIndexable = !/noindex/i.test(robotsMeta);

    const headingTagsRaw = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    const headingTags = headingTagsRaw.map(h => ({
        tag: h.tagName,
        content: h.textContent.trim()
    }));

    const headingOrder = headingTags.map(h => h.tag); // e.g., ["H1", "H2", "H3", ...]

    const headingCount = {
        H1: 0,
        H2: 0,
        H3: 0,
        H4: 0,
        H5: 0,
        H6: 0
    };

    headingTags.forEach(h => {
        headingCount[h.tag]++;
    });

    chrome.runtime.sendMessage({
        type: "META_DATA",
        payload: {
            title: metaTitle,
            description: metaDescription,
            canonical: canonical,
            url: url,
            indexable: isIndexable,
            headingTags: headingTags, // Now includes both tag and content
            headingCount: headingCount,
            headingOrder: headingOrder
        }
    });
})();
