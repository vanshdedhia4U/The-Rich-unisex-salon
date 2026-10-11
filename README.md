# The Rich Unisex Salon - Luxury Hair, Skin & Wellness Website

Official web application for **The Rich Unisex Salon**, Ambernath East. Features full service catalog, interactive online appointment scheduling with instant time slots, lookbook gallery, client self-service portal, and owner admin management.

---

## 🚀 How to Deploy on GitHub Pages (Fixing Blank Screen)

If you uploaded this website to GitHub and see a blank white page, it is because GitHub Pages defaults to serving unbuilt source code files instead of running the Vite build.

Here is how to deploy in 2 clicks:

### Method 1: Using GitHub Actions (Recommended & Automatic)

This repository includes an automated GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Go to your repository on GitHub.
2. Click **Settings** (tab at the top).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, click the dropdown and choose **GitHub Actions** (instead of "Deploy from a branch").
5. That's it! GitHub will automatically run the build and publish your site at `https://<your-username>.github.io/<repo-name>/`.

---

### Method 2: Deploying via `/docs` Folder (No Actions Needed)

The repository also includes a pre-built `/docs` folder ready for GitHub Pages:

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages**.
3. Under **Build and deployment** > **Source**, keep **Deploy from a branch**.
4. Under **Branch**, select `main` (or `master`) and change the folder from `/(root)` to **/docs**.
5. Click **Save**. Your site will be live within 1 minute!

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
