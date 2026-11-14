/** Resolve a file in Vite's public directory relative to the configured base. */
export function publicAssetUrl(path: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL;
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const assetPath = path.replace(/^\/+/, '');

  return `${base}${assetPath}`;
}
