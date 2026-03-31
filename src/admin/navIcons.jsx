/** Small inline SVGs for admin sidebar (24×24, stroke) */
const s = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconBrand() {
  return (
    <svg {...s} aria-hidden>
      <path d="M4 20V10l8-6 8 6v10M9 20v-6h6v6" />
    </svg>
  );
}

export function IconHero() {
  return (
    <svg {...s} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l5-5 4 4 5-6 4 4" />
    </svg>
  );
}

export function IconIntro() {
  return (
    <svg {...s} aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

export function IconRooms() {
  return (
    <svg {...s} aria-hidden>
      <path d="M3 10.5V20h6v-6h6v6h6v-9.5a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4a2 2 0 0 0-1 1.73z" />
      <path d="M9 22v-6h6v6" />
    </svg>
  );
}

export function IconAmenities() {
  return (
    <svg {...s} aria-hidden>
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
    </svg>
  );
}

export function IconGallery() {
  return (
    <svg {...s} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function IconPromo() {
  return (
    <svg {...s} aria-hidden>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

export function IconContact() {
  return (
    <svg {...s} aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

export function IconMenu() {
  return (
    <svg {...s} aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconLogout() {
  return (
    <svg {...s} width={18} height={18} aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
