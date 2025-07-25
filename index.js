document.addEventListener("DOMContentLoaded", () => {
    const box = document.getElementById("textbox");
    const title = document.getElementById("title");
    const madeBy = document.getElementById("made-by");
    const dataPrivacy = document.getElementById("data-privacy");
    const privacyPopup = document.getElementById("privacy-popup");
    const blahaj = document.getElementById("blahaj-cursor");
    const copy = document.getElementById("icon-copy");
    const reset = document.getElementById("icon-delete");
    const iconbar = document.getElementById("iconbar");
    const icons = [copy, reset];
    const main = document.querySelector("main");

    const placeholders = [
        "I love you :3",
        "Welcome to ClipClap",
        "Everyone is welcome!",
        "No one is illegal!!",
        "WHY ARE YOU MY CLARITYYYYYY",
        "Your ad could be here.",
        "Mwah mwah mwah :3"
    ];
    box.placeholder = placeholders[Math.random() * placeholders.length | 0];

    if (location.hash.length > 1) {
        box.value = lzbase62.decompress(location.hash.slice(1));
    }

    box.addEventListener("input", () => {
        const compressed = lzbase62.compress(box.value);
        history.replaceState(null, "", "#" + compressed);
    });

    title.addEventListener("mousedown", e => {
        if (e.button === 0) {
            box.value = "";
            history.replaceState(null, "", location.href.split("#")[0]);
        }
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
        el.addEventListener("mouseleave", () => { blahaj.style.opacity = "0" });
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
        navigator.clipboard.writeText(location.href);
    });

    reset.addEventListener("click", () => {
        box.value = "";
        history.replaceState(null, "", location.href.split("#")[0]);
    });

    function togglePrivacy() {
        const dlg = document.getElementById("privacy-popup");
        dlg.open ? dlg.close() : dlg.showModal();
    }
});
