# The Rich Unisex Salon - Deployment Guide

This project is built with React 19, Vite, and Tailwind CSS. It is configured to run out-of-the-box on GitHub Pages, Vercel, Netlify, or custom hosting.

---

## 🚀 Option 1: Automatic Deployment on GitHub Pages (Recommended)

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Steps:
1. **Push your repository** to GitHub:
   ```bash
   git add .
   git commit -m "Deploy The Rich Unisex Salon website"
   git push origin main
   ```
2. On your GitHub repository page:
   - Go to **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. That's it! GitHub will automatically trigger the build workflow, generate the site with relative assets (`./assets/...`), and host it at:
   `https://<your-username>.github.io/<repository-name>/`

---

## 📦 Option 2: Deploy Built Files Manually (`dist/`)

If you want to upload only the compiled website files:
1. Run the build command locally:
   ```bash
   npm run build
   ```
2. The compiled website is ready in the `dist/` directory.
3. You can:
   - Upload the contents of `dist/` directly to any web host (cPanel, Hostinger, GoDaddy, AWS S3, etc.).
   - Or push the `dist/` folder to a `gh-pages` branch on GitHub.

---

## ⚡ Option 3: Deploy to Vercel or Netlify (100% Free & Fast)

1. Connect your GitHub repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**. Your custom domain or `.vercel.app` link will be active immediately.

---

## 🛠 Why was it showing a blank screen before?
- Standard Vite projects default to absolute root URLs (`/assets/...`), which look for assets at the root domain (`username.github.io/assets/...`) instead of your repository's sub-folder (`username.github.io/your-repo/assets/...`).
- We configured `base: './'` in `vite.config.ts`, added a universal asset resolver, created a `.nojekyll` configuration, and wrapped the app in an `ErrorBoundary` with fallback loading screen so the application resolves properly in any hosting environment.
