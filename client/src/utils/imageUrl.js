export function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url; // already a full external URL
  return `${import.meta.env.VITE_API_URL}${url}`;    // relative path from our own upload
}