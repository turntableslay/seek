# Seek Trinity Groves website

One-page site for Seek Trinity Groves, 3011 Gulden Ln, Ste 112, Dallas, TX 75212.
Everything Cloudflare publishes lives in `public/`.

## Cloudflare Pages settings
- Framework preset: None
- Build command: `exit 0`
- Build output directory: `public`

## Before launch
1. **Event form**: in `public/index.html`, replace `YOUR_FORM_ID` in the form `action` with the client's Formspree form ID.
2. **Hours & happy hour**: confirm with the client. Update both the hours list in `index.html` and `HOURS` at the top of `public/script.js` (it drives the "Open now" badge).
3. **Menu**: dish names come from the photos and the brief; swap in the client's real menu and prices.
4. **Custom domain**: add it under the Pages project → Custom domains.

## Sections
Hero slideshow + reserve → Happy hour & weekly lineup → Menu → Gallery (two scrolling rows + lightbox) → Event booking → Visit (hours, map).

## Photos
`public/img/` holds web-optimized WebP crops (640px and full width) of the client's photo shoot, plus `og.jpg` for link previews.
To swap a photo, export a new file at the same name and aspect ratio.
