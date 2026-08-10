export function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url; // already a full external URL
  return `http://localhost:5000${url}`;    // relative path from our own upload
}