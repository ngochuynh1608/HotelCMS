export function getContactHref(value) {
  const v = String(value || "").trim();
  if (!v) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  const compact = v.replace(/[\s().-]/g, "");
  if (/^\+?\d{8,15}$/.test(compact)) return `tel:${compact}`;
  if (v.length > 10 && /[A-Za-zÀ-ỹ]/.test(v)) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
  }
  return null;
}
