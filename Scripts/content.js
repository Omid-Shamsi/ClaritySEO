(() => {
    const getMetaContent = (selector, fallback) => {
        const el = document.querySelector(selector);
        return el && el.content?.trim() ? el.content.trim() : fallback;
    };

    const metaTitle = document.title.trim() || "No title available!";
    const metaDescription = getMetaContent("meta[name='description']", "No description available!");
    const canonical = document.querySelector("link[rel='canonical']")?.href?.trim() || "No canonical URL available!";
    const url = window.location.href || "No URL available!";




    chrome.runtime.sendMessage({
        type: "META_DATA",
        payload: {
            title: metaTitle,
            description: metaDescription,
            canonical: canonical,
            url: url
        }
    });
})();
