import { useEffect, useRef } from "react";

const loadedOnce = new Set();
const inflight = new Map();

function ensureStylesheet(href) {
  if (!href) return;
  const key = href.startsWith("//") ? `${window.location.protocol}${href}` : href;
  if ([...document.querySelectorAll("link[data-booking-css]")].some((node) => node.dataset.bookingCss === key)) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = href;
  link.dataset.bookingCss = key;
  document.head.appendChild(link);
}

function isReloadScript(src, kind) {
  if (kind === "search") return /searchWidgetCustomize/i.test(src);
  return /\/widgetCustomize/i.test(src) && !/searchWidgetCustomize/i.test(src);
}

function reservationUrlFromForm(form) {
  const fd = new FormData(form);
  const params = new URLSearchParams();
  const aliases = {
    checkin: ["checkin", "CheckIn", "checkIn", "fromDate", "arrival", "ArrivalDate", "dateFrom", "CheckInDate"],
    checkout: ["checkout", "CheckOut", "checkOut", "toDate", "departure", "DepartureDate", "dateTo", "CheckOutDate"],
    guests: ["guests", "adults", "Adults", "numAdults", "occupancy"],
  };
  for (const [canon, names] of Object.entries(aliases)) {
    for (const name of names) {
      const value = fd.get(name);
      if (value) {
        params.set(canon, String(value));
        break;
      }
    }
  }
  const qs = params.toString();
  return qs ? `/reservation?${qs}` : "/reservation";
}

function goToReservation(form) {
  window.location.assign(reservationUrlFromForm(form));
}

function wireSearchForm(host) {
  const form = host.querySelector("#searchWidgetForm, form");
  if (!form || form.dataset.spaWired === "1") return Boolean(form);
  form.dataset.spaWired = "1";
  form.setAttribute("method", "get");
  form.setAttribute("action", "/reservation");
  form.setAttribute("target", "_self");
  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
      goToReservation(form);
    },
    true
  );
  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], .btn, button');
  if (submitBtn && submitBtn.dataset.spaWired !== "1") {
    submitBtn.dataset.spaWired = "1";
    submitBtn.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        goToReservation(form);
      },
      true
    );
  }
  return true;
}

function loadExternalScript(src, tracker, kind) {
  const reload = isReloadScript(src, kind);
  const marker = kind === "search" ? "search-customize" : "booking-customize";
  if (!reload && loadedOnce.has(src)) return Promise.resolve();
  if (!reload && inflight.has(src)) return inflight.get(src);

  if (reload) {
    document.querySelectorAll(`script[data-hbe-script="${marker}"]`).forEach((node) => node.remove());
  }

  const pending = new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    if (reload) {
      el.dataset.hbeScript = marker;
      tracker.push(el);
    }
    el.onload = () => {
      if (!reload) loadedOnce.add(src);
      resolve();
    };
    el.onerror = () => reject(new Error(`Không tải được ${src}`));
    document.body.appendChild(el);
  });

  if (!reload) inflight.set(src, pending);
  return pending;
}

export function BookingEngineEmbed({ html, kind = "booking", className = "booking-embed" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const trimmed = String(html || "").trim();
    if (!trimmed) {
      host.replaceChildren();
      return undefined;
    }

    let cancelled = false;
    const extra = [];

    (async () => {
      const parsed = new DOMParser().parseFromString(trimmed, "text/html");
      const nodes = [...parsed.head.childNodes, ...parsed.body.childNodes];
      const fragment = document.createDocumentFragment();
      const scripts = [];

      for (const node of nodes) {
        if (node.nodeName === "SCRIPT") {
          scripts.push({
            src: node.getAttribute?.("src") || "",
            code: node.textContent || "",
          });
        } else if (node.nodeName === "LINK") {
          const rel = (node.getAttribute("rel") || "").toLowerCase();
          if (!rel || rel.includes("stylesheet")) {
            ensureStylesheet(node.getAttribute("href") || "");
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          fragment.appendChild(document.importNode(node, true));
        }
      }

      if (cancelled) return;
      host.replaceChildren(fragment);

      for (const item of scripts) {
        if (cancelled) return;
        try {
          if (item.src) await loadExternalScript(item.src, extra, kind);
          else if (item.code.trim()) {
            const el = document.createElement("script");
            el.text = item.code;
            document.body.appendChild(el);
            extra.push(el);
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (cancelled || kind !== "search") return;
      wireSearchForm(host);
      const observer = new MutationObserver(() => wireSearchForm(host));
      observer.observe(host, { childList: true, subtree: true });
      extra.push({ remove: () => observer.disconnect() });
    })();

    return () => {
      cancelled = true;
      extra.forEach((node) => node.remove());
      host.replaceChildren();
    };
  }, [html, kind]);

  return <div className={className} ref={hostRef} />;
}
