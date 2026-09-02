import { Link, NavLink } from "react-router-dom";

function scrollToHash(id) {
  if (!id || window.location.pathname !== "/") return;
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = 86;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo(0, Math.max(0, top));
}

export function SiteCta({ href, className, children, onClick }) {
  const to = href || "/reservation";
  if (/^https?:\/\//i.test(to)) {
    return (
      <a className={className} href={to} target="_blank" rel="noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }
  if (to.includes("#")) {
    const target = to.startsWith("#") ? `/${to}` : to;
    const id = target.split("#")[1] || "";
    return (
      <Link
        className={className}
        to={target}
        onClick={(event) => {
          onClick?.(event);
          window.setTimeout(() => scrollToHash(id), 0);
          window.setTimeout(() => scrollToHash(id), 80);
        }}
      >
        {children}
      </Link>
    );
  }
  return (
    <NavLink
      className={className}
      to={{ pathname: to, hash: "" }}
      onClick={(event) => {
        onClick?.(event);
        window.scrollTo(0, 0);
      }}
    >
      {children}
    </NavLink>
  );
}
