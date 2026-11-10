# Seek Trinity Groves website

One-page site for Seek Trinity Groves, 3011 Gulden Ln, Ste 112, Dallas, TX 75212.
Plain HTML, CSS and JavaScript. There is no build step, so Cloudflare Pages serves the files exactly as they are.

## What's in this folder

| File | What it does |
|---|---|
| `index.html` | The page: hero, happy hour lineup, menu, gallery, events, hours |
| `style.css` | All styling |
| `script.js` | Open/closed status, slideshow, menu popup, gallery viewer |
| `img/` | Photos, logo, the two menu images and the social share image (`og.jpg`) |
| `404.html` | Branded "page not found" page |
| `_headers` | Cloudflare caching and security settings |
| `robots.txt` | Lets search engines index the site |

## First-time setup

### 1. Put the files on GitHub
1. Sign in at github.com and click **New repository** (the + in the top right).
2. Name it `seek-trinity-groves`, leave it **Public** or **Private**, and click **Create repository**. Don't add a README; this folder already has one.
3. On the empty repo page, click **uploading an existing file**.
4. Open this `seek-trinity-groves` folder on your computer, select **everything inside it** (including the `img` folder), and drag it into the browser.
   - Upload the *contents*, not the folder itself. `index.html` must sit at the top level of the repo.
   - Files that start with a dot (`.gitignore`) can be hidden on Mac. Press Cmd + Shift + . in Finder to show them. It's fine if it gets left out.
5. Scroll down and click **Commit changes**.

### 2. Connect Cloudflare Pages
1. Sign in at dash.cloudflare.com and go to **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
2. Authorize GitHub and pick the `seek-trinity-groves` repo.
3. On the build settings screen:
   - **Framework preset:** None
   - **Build command:** leave empty
   - **Build output directory:** `/`
4. Click **Save and Deploy**. After about a minute the site is live at `seek-trinity-groves.pages.dev` (Cloudflare may add a suffix if the name is taken).

### 3. Add the client's domain (optional)
1. In the Pages project, open **Custom domains** > **Set up a custom domain**.
2. Enter the domain (for example `seektrinitygroves.com`) and follow the prompts. If the domain's DNS is already on Cloudflare it connects automatically; otherwise Cloudflare shows the record to add at the registrar.
3. Once the domain works, update the two `og:image` lines in `index.html` to the full address (for example `https://seektrinitygroves.com/img/og.jpg`) so link previews on iMessage, Instagram and Facebook show the photo.

## Making updates later
1. In the GitHub repo, open the file (for example `index.html`), click the pencil icon, edit, then **Commit changes**.
   To replace an image, open the `img` folder, click **Add file** > **Upload files**, and upload a file with the **same name**.
2. Cloudflare redeploys automatically within a minute or two of every commit.
3. If you don't see the change, hard-refresh (Cmd + Shift + R on Mac, Ctrl + F5 on Windows).

## Where to change common things

| To change | Edit |
|---|---|
| Hours list | `index.html`, the `hoursList` section near the bottom |
| Open/closed status and "Tonight" info | `script.js`, the `HOURS`, `EVENTS` and `HAPPY` lines near the top |
| Weekly event cards | `index.html`, the `<ul class="week">` section |
| Menu popup images | Replace `img/menu-food.webp` and `img/menu-drinks.webp` (keep the names) |
| Reservation link (Resy) | Search `index.html` for `resy.com` |
| Event request link (Tripleseat) | Search `index.html` for `tripleseat.com` |
| Search engine hours | `index.html`, `openingHoursSpecification` near the top |

When hours change, update all three places: the hours list, the `HOURS` line in `script.js`, and `openingHoursSpecification`.
