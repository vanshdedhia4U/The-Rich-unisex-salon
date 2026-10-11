# The Rich Unisex Salon - Luxury Hair, Skin & Wellness Website

Official web application for **The Rich Unisex Salon**, Ambernath East. Features full service catalog, interactive online appointment scheduling with instant time slots, lookbook gallery, client self-service portal, and owner admin management.

---

## 🚀 How to Deploy on GitHub Pages (Fixing "Only Name Showing / Loading")

### Why did you only see "The Rich Unisex Salon" and "Loading luxury experience..."?
1. **GitHub Pages Root Serving**: When GitHub Pages is set to **"Deploy from a branch"** with the folder set to **`/(root)`**, GitHub Pages served raw source files (`/src/main.tsx`). Web browsers cannot execute uncompiled TypeScript/JSX directly, so the page stayed paused on the initial HTML text.
2. **Missing Trailing Slash**: If visiting `https://username.github.io/repo` without a trailing slash `/`, browsers look for assets at the root domain (`https://username.github.io/assets/`) instead of inside your repository folder (`https://username.github.io/repo/assets/`).

### How We Fixed It:
- **Triple-Compatibility Build**: The repository now comes pre-built into `docs/`, `dist/`, AND root `assets/`.
- **Automatic Trailing Slash Redirect**: Subfolder URLs are immediately normalized to include the trailing slash.
- **Smart Static Fallback**: If served statically from the repository root, `index.html` automatically detects the static environment and boots the compiled production bundle.

---

### Step-by-Step GitHub Pages Setup (Choose Any Option):

#### Option 1: Direct `/docs` Folder (Simplest — 1 Minute)
1. Go to your repository on GitHub.
2. Click **Settings** (tab at the top) → **Pages** (on the left menu).
3. Under **Build and deployment** > **Source**, keep **Deploy from a branch**.
4. Under **Branch**, select `main` (or `master`) and change the folder dropdown from `/(root)` to **/docs**.
5. Click **Save**. Refresh in 1 minute and the entire website will load with all images and features!

#### Option 2: Automatic GitHub Actions (Professional)
1. Go to your GitHub repository → **Settings** → **Pages**.
2. Under **Build and deployment** > **Source**, click the dropdown and choose **GitHub Actions**.
3. GitHub will run `.github/workflows/deploy.yml` automatically on every commit.

#### Option 3: Deploy from `/ (root)`
With our new built-in static loader and synced `assets/` directory, deploying from **main / (root)** will now also automatically load the full website without being stuck!

---

## 💻 Local Development

1. Clone or open the project folder.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 📍 Salon Location & Details
- **Salon**: The Rich Unisex Salon
- **Address**: Shop No. 12, Parvati Building, Shivdham Complex, Kansai Section, Near Sibbu Place Family Restaurant, Station Road, Ambernath East, Maharashtra 421501
- **Google Maps**: [View on Google Maps](https://maps.app.goo.gl/wjGUuMvzgF2o4gGe9)
- **Hours**: Tuesday – Sunday: 8:00 AM – 11:00 PM (Monday Closed)
- **Primary Contact**: +91 80076 65669 / +91 86691 17402
