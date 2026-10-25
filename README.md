# Seek Trinity Groves website

Static site (HTML, CSS, one small JS file). No build step. Everything that gets published lives in `public/`.

```
public/
  index.html  style.css  script.js  404.html  favicon.svg  robots.txt
  _headers            Cloudflare security and cache headers
  images/             logo.jpg, dining-room.jpg (add more photos here)
```

## Before you go live

1. **Contact form:** create a free form at formspree.io, then in `public/index.html` replace `YOUR_FORM_ID` with your form's ID. If you use a different form service, also change `form-action` in `public/_headers`.
2. **Photos:** drop images into `public/images/` using the filenames referenced in `index.html` (`catfish-plate.jpg`, `patio.jpg`, `cocktails.jpg`, `lounge.jpg`, `seafood-boil.jpg`, `dj-night.jpg`, `patio-night.jpg`). Until then the page shows branded placeholders.
3. **Check the content:** hours (Monday and Tuesday are shown as closed), the Resy link, and the footer "Privacy policy" link, which currently points to `#`.
4. **Optional:** once you have a domain, add an `og:image` tag (full URL to the logo) so links preview with a picture when shared.

## 1. Put the code on GitHub

Create an empty repository on github.com (for example `seek-trinity-groves`, no README), then from this folder:

```
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/seek-trinity-groves.git
git push -u origin main
```

No git installed? On the new repo page choose "uploading an existing file" and drag in the contents of this folder.

## 2. Deploy on Cloudflare Pages

1. Cloudflare dashboard, **Workers & Pages**, **Create application**, **Pages**, **Connect to Git**.
2. Authorize GitHub and select the repository.
3. Build settings:
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: `exit 0`
   - Build output directory: `public`
4. **Save and Deploy.** The site goes live at `https://PROJECT-NAME.pages.dev` in about a minute.

Cloudflare is moving some products toward Workers, so button labels may differ slightly. Look for the Pages option under Workers & Pages.

## 3. Custom domain

Pages project, **Custom domains**, **Set up a custom domain**, and follow the prompts. If the domain's DNS is on Cloudflare the records are added for you. Otherwise add the CNAME it shows at your registrar. A root domain (no `www`) generally needs the domain's nameservers on Cloudflare. HTTPS is automatic.

## 4. Updating the site

Edit files, then:

```
git add .
git commit -m "Update menu"
git push
```

Every push to `main` redeploys automatically. Pushes to other branches get their own preview URL.

## Optional

- Cloudflare **Web Analytics** can be switched on from the Pages project, with no cookies or code changes.
