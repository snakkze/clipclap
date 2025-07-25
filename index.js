document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("textbox");
    const title = document.getElementById("title");
    const madeBy = document.getElementById("made-by");
    const dataPrivacy = document.getElementById("data-privacy");
    const privacyPopup = document.getElementById("privacy-popup");
    const shortenerPopup = document.getElementById("shortener-popup");
    const encryptionPopup = document.getElementById("super-secret-key-popup");
    const blahaj = document.getElementById("blahaj-cursor");
    const encrypt = document.getElementById("icon-encrypt");
    const encryptSsc = document.getElementById("encrypt-ssc");
    const decryptSsc = document.getElementById("decrypt-ssc");
    const copy = document.getElementById("icon-copy");
    const reset = document.getElementById("icon-delete");
    const iconbar = document.getElementById("iconbar");
    const icons = [copy, reset, encrypt];
    const main = document.querySelector("main");

    let super_secret_key = "";

    const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    function toBase62(uint8Array) {
        let num = BigInt(0);
        for (let byte of uint8Array) {
            num = (num << BigInt(8)) + BigInt(byte);
        }
        if (num === BigInt(0)) return "0";

        let result = "";
        while (num > 0) {
            result = BASE62[num % BigInt(62)] + result;
            num = num / BigInt(62);
        }
        return result;
    }

    function fromBase62(str) {
        let num = BigInt(0);
        for (let char of str) {
            num = num * BigInt(62) + BigInt(BASE62.indexOf(char));
        }

        const bytes = [];
        while (num > 0) {
            bytes.unshift(Number(num % BigInt(256)));
            num = num / BigInt(256);
        }
        return new Uint8Array(bytes);
    }

    function compressToHash(text) {
        const textData = new TextEncoder().encode(text);
        const compressed = pako.gzip(textData);
        const base62 = toBase62(compressed);

        if (super_secret_key != "") {
            return CryptoJS.AES.encrypt(base62, super_secret_key).toString();
        }
        return base62;
    }

    function decompressFromHash(hash) {
        if (!hash || hash.trim() === "") {
            return "";
        }
        try {
            let compressed;

            if (super_secret_key !== "") {
                const decryptedBase62 = CryptoJS.AES.decrypt(hash, super_secret_key).toString(CryptoJS.enc.Utf8);
                compressed = fromBase62(decryptedBase62);
            } else {
                compressed = fromBase62(hash);
            }

            const decompressed = pako.ungzip(compressed);
            return new TextDecoder().decode(decompressed);

        } catch (e) {
            console.error("Decompression failed/Wrong SSC:", e)
            return ""
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

    encrypt.addEventListener("click", () => {
        encryptionPopup.showModal();
    });

    const sscBox = document.getElementById("super-secret-key-textbox");
    encryptSsc.addEventListener("click", () => {
        if (box.value != "") {    
            super_secret_key = sscBox.value;
            const compressedHash = compressToHash(box.value);
            if (compressedHash !== null) {
                history.replaceState(null, "", "#" + compressedHash);
            }
        }
    });

    decryptSsc.addEventListener("click", () => {
        const hashContent = location.hash.slice(1);
        super_secret_key = sscBox.value;

        if (!hashContent) {
            return;
        }

        const text = decompressFromHash(hashContent);
        box.value = text;

        super_secret_key = ""
        sscBox.value = ""
        history.replaceState(null, "", location.pathname);
    });


    [privacyPopup, shortenerPopup, encryptionPopup].forEach(el => {
        el.addEventListener("click", e => {
            const rect = el.getBoundingClientRect();
            if (
                e.clientX < rect.left || e.clientX > rect.right ||
                e.clientY < rect.top || e.clientY > rect.bottom
            ) {
                el.close();
            }
        });
    });

    document.querySelectorAll('.copy-field').forEach(el => {
        el.addEventListener('click', () => {
            const text = el.innerText.trim();
            navigator.clipboard.writeText(text)
                .then(() => console.log("Copied:", text))
                .catch(err => console.error("Clipboard error:", err));
        });
    });

    copy.addEventListener("click", () => {
        const compressed = compressToHash(box.value);
        const fullUrl = location.origin + location.pathname + "#" + compressed;

        if (fullUrl.length > 125) {
            const shortUrlEl = document.getElementById("short-url");
            const longUrlEl = document.getElementById("long-url");

            shortUrlEl.textContent = "Click to Shorten";
            shortUrlEl.title = "Click to generate short URL";
            longUrlEl.textContent = fullUrl;
            longUrlEl.title = fullUrl;

            shortenerPopup.showModal();

            const generateShortUrl = () => {
                shortUrlEl.removeEventListener("click", generateShortUrl);

                const loopTexts = ["Ooo", "oOo", "ooO"];
                let i = 0;

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
                    })
                    .catch(() => {
                        clearInterval(anim);
                        shortUrlEl.textContent = "Error generating URL";
                        shortUrlEl.title = "Error generating URL";
                    });
            };
            shortUrlEl.addEventListener("click", generateShortUrl);

            // TODO: mouse click url for new tab shorten url yk, save shortened url if nothing changed to browser 
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