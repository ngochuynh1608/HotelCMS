const PATHS = {
  facebook:
    "M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.03H7.9v-2.9h2.54V9.86c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.8l-.45 2.9h-2.35V22C18.34 21.27 22 17.1 22 12.07z",
  instagram:
    "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.87 1.35a1.07 1.07 0 1 1 0 2.14 1.07 1.07 0 0 1 0-2.14zM12 7.4A4.6 4.6 0 1 1 7.4 12 4.6 4.6 0 0 1 12 7.4zm0 1.8A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2z",
};

export function SocialIcons({ links, lang }) {
  if (!links?.length) return null;
  return links.map((link) => {
    const path = PATHS[link.platform] || PATHS.facebook;
    const aria = lang === "vi" ? link.ariaVi : link.ariaEn;
    return (
      <a key={link.id} className="social-link" href={link.href} aria-label={aria || link.label}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={path} />
        </svg>
        {link.label}
      </a>
    );
  });
}
