document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("textbox");
    const title = document.getElementById("title");
    const madeBy = document.getElementById("made-by");
    const dataPrivacy = document.getElementById("data-privacy");
    const privacyPopup = document.getElementById("privacy-popup");
    const shortenerPopup = document.getElementById("shortener-popup");
    const blahaj = document.getElementById("blahaj-cursor");
    const copy = document.getElementById("icon-copy");
    const reset = document.getElementById("icon-delete");
    const iconbar = document.getElementById("iconbar");
    const icons = [copy, reset];
    const main = document.querySelector("main");

    function compressToHash(text) {
        try {
            const textData = new TextEncoder().encode(text);
            const compressed = pako.gzip(textData);
            const base64String = btoa(String.fromCharCode(...compressed));
            const urlSafeBase64 = base64String.replace(/\+/g, '-').replace(/\//g, '_');
            return urlSafeBase64;
        } catch (e) {
            console.error("Komprimierung fehlgeschlagen:", e);
            return ""; 
        }
    }

    function decompressFromHash(hash) {
        if (!hash || hash.trim() === "") {
            return ""; 
        }
        
        try {
            let base64String = hash.replace(/-/g, '+').replace(/_/g, '/');
            const compressed = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
            const decompressed = pako.ungzip(compressed);
            const text = new TextDecoder().decode(decompressed);
            return text;
        } catch (e) {
            console.error("Dekomprimierung fehlgeschlagen:", e);
            return ""; 
        }
    }

    const placeholders = [
        "I love you :3",
        "Welcome to ClipClap",
        "Everyone is welcome!",
        "No one is illegal!!",
        "WHY ARE YOU MY CLARITYYYYYY",
        "Your ad could be here.",
        "Mwah mwah mwah :3"
    ];
    box.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];

    if (location.hash.length > 1) {
        const hashContent = location.hash.slice(1);
        box.value = decompressFromHash(hashContent);
    }

    box.addEventListener("input", () => {
        const compressedHash = compressToHash(box.value);
        if (compressedHash !== null) {
            history.replaceState(null, "", "#" + compressedHash);
        }
    });

    title.addEventListener("mousedown", e => {
        if (e.button === 0) {
            box.value = "";
            history.replaceState(null, "", location.href.split("#")[0]);
        }
    });

    reset.addEventListener("click", () => {
        box.value = "";
        history.replaceState(null, "", location.href.split("#")[0]);
    });

    document.addEventListener("mousemove", e => {
        if (!main.contains(e.target) && !iconbar.contains(e.target)) {
            icons.forEach(i => i.style.opacity = '0');
            return;
        }

        const r = iconbar.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const max = innerWidth * 0.25;
        const o = Math.max(0.1, 1 - d / max);

        icons.forEach(i => i.style.opacity = o);
    });

    [madeBy, dataPrivacy].forEach(el => {
        el.addEventListener("mouseenter", () => { blahaj.style.opacity = "1"; });
        el.addEventListener("mouseleave", () => { blahaj.style.opacity = "0"; });
        el.addEventListener("mousemove", e => {
            blahaj.style.left = (e.clientX - 25) + "px";
            blahaj.style.top = (e.clientY + 10) + "px";
        });
    });

    dataPrivacy.addEventListener("click", () => {
        privacyPopup.showModal();
    });

    privacyPopup.addEventListener("click", e => {
        const rect = privacyPopup.getBoundingClientRect();
        if (
            e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom
        ) {
            privacyPopup.close();
        }
    });

    copy.addEventListener("click", () => {
        const compressed = compressToHash(box.value);
        const fullUrl = location.origin + location.pathname + "#" + compressed;

        if (fullUrl.length > 125) {
            const shortUrlEl = document.getElementById("short-url");
            const longUrlEl = document.getElementById("long-url");

            const loopTexts = ["Ooo", "oOo", "ooO"];
            let i = 0;

            shortUrlEl.textContent = loopTexts[i];
            shortUrlEl.title = "Generating short URL...";
            longUrlEl.textContent = fullUrl;
            longUrlEl.title = fullUrl;

            shortenerPopup.showModal();

            const anim = setInterval(() => {
                i = (i + 1) % loopTexts.length;
                shortUrlEl.textContent = loopTexts[i];
            }, 300);

            fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(fullUrl)}`)
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(d => {
                    clearInterval(anim);
                    const url = d.shorturl || "failed to generate :c";
                    shortUrlEl.textContent = url;
                    shortUrlEl.title = url;
                });
        } else {
            navigator.clipboard.writeText(fullUrl);
        }
    });


    ["short-url", "long-url"].forEach(id => {
        const el = document.getElementById(id); 
        el.addEventListener("click", () => navigator.clipboard.writeText(el.textContent));
        el.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigator.clipboard.writeText(el.textContent);
            }
        });
    });
});