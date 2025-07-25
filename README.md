# ClipClap

ClipClap is a minimal, fully client-side paste tool. Text is compressed (gzip), optionally encrypted (AES), base62 encoded, and stored in the URL hash. There is no backend, no database, and no tracking.

## Features

- fully in-browser
- no data stored anywhere
- gzip compression via [pako](https://github.com/nodeca/pako)
- optional AES encryption using [CryptoJS](https://github.com/brix/crypto-js)
- content is encoded in the URL hash.
- optional link shortening using `is.gd` if the URL is too long

## How it works

1. You type something.
2. The text is compressed and base62-encoded.
3. If you want, you can encrypt it with a passphrase.
4. The result is placed into the URL hash.
5. You can share the link. No data ever leaves your browser.

On page load, the content is extracted from the hash, decompressed, and shown again. If encryption was used, the correct passphrase is required to read it.
