/**
 * Universal Asset URL resolver
 * Ensures images and public assets work seamlessly on GitHub Pages (sub-paths),
 * custom domains, preview servers, and local development.
 */
export function getAssetUrl(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Strip leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // import.meta.env.BASE_URL is managed by Vite base config
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return `${cleanBase}${cleanPath}`;
}
