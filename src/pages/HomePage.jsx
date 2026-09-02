import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { SocialIcons } from "../components/SocialIcons.jsx";
import { SiteCta } from "../components/SiteCta.jsx";
import { BookingBar } from "../components/BookingBar.jsx";
import { BookingEngineEmbed } from "../components/BookingEngineEmbed.jsx";
import { useSiteContent } from "../site-content/useSiteContent.js";
import { getRoomHref } from "../utils/roomUtils.js";
import { getContactHref } from "../utils/contactLinks.js";

function pick(lang, o) {
  if (!o || typeof o !== "object") return "";
  return lang === "vi" ? o.vi : o.en;
}

function keyFromPossibleObject(v) {
  if (v == null) return "";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

const FALLBACK_TRUST = [
  { value: "9.7", label: { vi: "Điểm dịch vụ", en: "Guest score" } },
  { value: "85", label: { vi: "Phòng & suite", en: "Rooms & suites" } },
  { value: "2 km", label: { vi: "Phố cổ Hội An", en: "Ancient Town" } },
  { value: "3 km", label: { vi: "Biển Cửa Đại", en: "Cua Dai Beach" } },
];

function IconArea() {
  return (
    <svg className="room-meta-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 10h16M10 4v16" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconBed() {
  return (
    <svg className="room-meta-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 18V12a2 2 0 0 1 2-2h2V8a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 17 8v2h2a2 2 0 0 1 2 2v6M3 14h18M6 18v2M18 18v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RoomCardMeta({ room, lang }) {
  if (!room.area && !room.beds) return null;
  const bedLabel = lang === "vi"
    ? `${room.beds} giường`
    : `${room.beds} bed${Number(room.beds) === 1 ? "" : "s"}`;
  return (
    <p className="room-card-meta">
      {room.area ? (
        <span>
          <IconArea />
          {room.area} m²
        </span>
      ) : null}
      {room.beds ? (
        <span>
          <IconBed />
          {bedLabel}
        </span>
      ) : null}
    </p>
  );
}

export default function HomePage() {
  const { lang = "en" } = useOutletContext() ?? {};
  const { content } = useSiteContent();
  const hero = content.hero || {};
  const slides = useMemo(
    () => (hero.slides?.length ? hero.slides : [{ type: "image", src: "", alt: "" }]),
    [hero.slides]
  );
  const slideMs = Math.max(2000, hero.slideIntervalMs || 6600);

  const [slideIdx, setSlideIdx] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [activeAmenity, setActiveAmenity] = useState(null);
  const videoRefs = useRef({});

  const rooms = content.rooms?.items || [];
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (slides.length <= 1 || prefersReducedMotion) return;
    const t = window.setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), slideMs);
    return () => window.clearInterval(t);
  }, [slides.length, slideMs, prefersReducedMotion]);

  useEffect(() => {
    slides.forEach((s, i) => {
      if (s.type !== "video") return;
      const el = videoRefs.current[i];
      if (!el) return;
      if (i === slideIdx) el.play().catch(() => {});
      else el.pause();
    });
  }, [slideIdx, slides]);

  const intro = content.intro || {};
  const introImage = intro.sliderImages?.[0] || { src: "", alt: "" };
  const introText = (intro.paragraphs || []).map((p) => pick(lang, p)).filter(Boolean);
  const amenities = content.amenities?.items || [];
  const gallery = content.gallery?.images || [];
  const promotions = content.promotions?.items || [];
  const contact = content.contact || {};
  const booking = content.booking || {};
  const searchHtml = (lang === "en" ? booking.searchScriptEn : booking.searchScriptVi) || "";
  const trust = Array.isArray(content.trust) && content.trust.length ? content.trust : FALLBACK_TRUST;
  const featured = gallery[0];
  const galleryRest = gallery.slice(1);

  useEffect(() => {
    if (galleryIndex == null && !activeAmenity) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setGalleryIndex(null);
        setActiveAmenity(null);
      }
      if (galleryIndex == null || !gallery.length) return;
      if (e.key === "ArrowRight") setGalleryIndex((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [galleryIndex, activeAmenity, gallery.length]);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-slides" aria-hidden="true">
          {slides.map((slide, i) => (
            <div key={i} className={`hero-slide ${i === slideIdx ? "is-active" : ""}`}>
              {slide.type === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className="hero-slide-media hero-slide-video"
                  src={slide.src}
                  poster={slide.poster || ""}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
              ) : (
                <div
                  className="hero-slide-media hero-slide-image"
                  style={{ backgroundImage: slide.src ? `url(${slide.src})` : "none" }}
                  role="img"
                  aria-label={slide.alt || ""}
                />
              )}
            </div>
          ))}
        </div>
        <div className="container hero-content">
          <span className="hero-eyebrow">{pick(lang, hero.eyebrow)}</span>
          <h1 className="heading-serif">
            {pick(lang, hero.titleLine1)}
            <br />
            {pick(lang, hero.titleLine2)}
          </h1>
          <p className="hero-lead">{pick(lang, hero.subtitle)}</p>
        </div>
      </section>

      {searchHtml.trim() ? (
        <BookingEngineEmbed html={searchHtml} kind="search" className="search-widget-embed" />
      ) : (
        <BookingBar lang={lang} />
      )}

      <section className="trust-strip" aria-label={lang === "en" ? "Hotel facts" : "Thông tin khách sạn"}>
        <div className="container trust-grid">
          {trust.map((item, i) => (
            <div className="trust-item" key={i}>
              <strong>{item.value}</strong>
              <span>{typeof item.label === "string" ? item.label : pick(lang, item.label)}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="gioi-thieu" className="intro">
        <div className="container intro-editorial">
          <p className="section-kicker">{lang === "en" ? "The palace" : "Câu chuyện"}</p>
          <h2>{pick(lang, intro.sectionTitle)}</h2>
          <div className="intro-split">
            <article className="prose intro-copy">
              {introText.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              <SiteCta className="btn-text" href="/about-us">
                {lang === "en" ? "Read our story" : "Đọc thêm"}
              </SiteCta>
              <img
                className="intro-motif"
                src="/illustrations/chua-cau.webp"
                alt=""
                aria-hidden="true"
              />
            </article>
            {introImage.src ? (
              <figure className="intro-figure">
                <img src={introImage.src} alt={introImage.alt || pick(lang, intro.sectionTitle)} />
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <section id="phong" className="container">
        <div className="section-head is-left">
          <p className="section-kicker">{lang === "en" ? "Stay" : "Lưu trú"}</p>
          <h2>{pick(lang, content.rooms?.sectionTitle)}</h2>
          <p>{pick(lang, content.rooms?.sectionSubtitle)}</p>
        </div>
        <div className="room-grid">
          {rooms.map((room, idx) => {
            const price = typeof room.price === "object" ? pick(lang, room.price) : room.price;
            return (
              <Link
                key={room.name + idx}
                className="room-card"
                to={{ pathname: getRoomHref(room, idx), hash: "" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="room-card-media">
                  <img src={room.image} alt={room.name} />
                  <RoomCardMeta room={room} lang={lang} />
                </div>
                <div className="room-card-body">
                  <h3>{room.name}</h3>
                  {room.desc ? <p className="room-card-desc">{room.desc}</p> : null}
                  {price ? <span className="room-price">{price}</span> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="tien-ich">
        <div className="container">
          <div className="section-head is-left">
            <p className="section-kicker">{lang === "en" ? "Destinations" : "Điểm đến"}</p>
            <h2>
              {typeof content.amenities?.sectionTitle === "string"
                ? content.amenities.sectionTitle
                : pick(lang, content.amenities?.sectionTitle)}
            </h2>
            <p>
              {typeof content.amenities?.sectionSubtitle === "string"
                ? content.amenities.sectionSubtitle
                : pick(lang, content.amenities?.sectionSubtitle)}
            </p>
          </div>
        </div>
        {amenities.map((a, i) => {
          const titleText = typeof a.title === "string" ? a.title : pick(lang, a.title);
          const descText = typeof a.desc === "string" ? a.desc : pick(lang, a.desc);
          return (
            <article
              key={`${i}-${keyFromPossibleObject(a.title)}-${a.image || a.alt || ""}`}
              className={`destination ${i % 2 === 1 ? "is-reverse" : ""}`}
            >
              <div className="container destination-inner">
                <figure className="destination-media">
                  <img src={a.image} alt={a.alt || titleText || ""} />
                </figure>
                <div className="destination-copy">
                  <p className="section-kicker">{String(i + 1).padStart(2, "0")}</p>
                  <h3>{titleText}</h3>
                  <p className="destination-desc">{descText}</p>
                  <button type="button" className="btn-text" onClick={() => setActiveAmenity(a)}>
                    {lang === "vi" ? "Xem thêm" : "View details"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section id="hinh-anh" className="container">
        <div className="section-head is-left">
          <p className="section-kicker">{lang === "en" ? "House" : "Không gian"}</p>
          <h2>{pick(lang, content.gallery?.sectionTitle)}</h2>
          <p>{pick(lang, content.gallery?.sectionSubtitle)}</p>
        </div>
        {featured ? (
          <div className="gallery-editorial">
            <figure className="gallery-featured">
              <button
                type="button"
                onClick={() => setGalleryIndex(0)}
                aria-label={featured.alt || (lang === "vi" ? "Ảnh nổi bật" : "Featured photo")}
              >
                <img src={featured.src} alt={featured.alt || ""} />
              </button>
              {featured.alt ? <figcaption>{featured.alt}</figcaption> : null}
            </figure>
            {galleryRest.length > 0 ? (
              <div className="gallery-side">
                {galleryRest.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    className="gallery-item"
                    onClick={() => setGalleryIndex(i + 1)}
                    aria-label={g.alt || (lang === "vi" ? `Ảnh ${i + 2}` : `Photo ${i + 2}`)}
                  >
                    <img src={g.src} alt={g.alt || ""} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {promotions.length > 0 ? (
        <section id="promotions" className="container">
          <div className="section-head is-left">
            <p className="section-kicker">{lang === "en" ? "Offers" : "Ưu đãi"}</p>
            <h2>{pick(lang, content.promotions?.sectionTitle)}</h2>
            <p>{pick(lang, content.promotions?.sectionSubtitle)}</p>
          </div>
          <div className="offer-list">
            {promotions.map((p, i) => {
              const titleText = typeof p.title === "string" ? p.title : pick(lang, p.title);
              const descText = typeof p.desc === "string" ? p.desc : pick(lang, p.desc);
              return (
                <article key={`${i}-${keyFromPossibleObject(p.title)}`} className="offer-row">
                  {p.image ? <img src={p.image} alt={p.alt || titleText || ""} /> : null}
                  <div>
                    <h3>{titleText}</h3>
                    <p>{descText}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section id="lien-he" className="container">
        <div className="section-head is-left">
          <p className="section-kicker">{lang === "en" ? "Concierge" : "Liên hệ"}</p>
          <h2>{pick(lang, contact.sectionTitle)}</h2>
          <p>{pick(lang, contact.sectionSubtitle)}</p>
        </div>
        <div className="contact-wrap">
          <div className="contact">
            <h3>{pick(lang, contact.infoTitle)}</h3>
            {(contact.lines || []).map((line, i) => {
              const href = getContactHref(line.value);
              return (
                <p key={i}>
                  <strong>{pick(lang, line.label)}</strong>{" "}
                  {href ? (
                    <a
                      className="contact-value"
                      href={href}
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {line.value}
                    </a>
                  ) : (
                    line.value
                  )}
                </p>
              );
            })}
          </div>
          <div className="inquiry">
            <h3>{pick(lang, contact.socialTitle)}</h3>
            <p>{pick(lang, contact.socialDescription)}</p>
            <div className="social-links" aria-label="Social links">
              <SocialIcons links={contact.socialLinks} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {activeAmenity ? (
        <div className="site-modal-backdrop" onClick={() => setActiveAmenity(null)} role="presentation">
          <div
            className="site-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="amenity-dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="amenity-dialog-title">
              {typeof activeAmenity.title === "string" ? activeAmenity.title : pick(lang, activeAmenity.title)}
            </h3>
            {activeAmenity.image ? (
              <img
                src={activeAmenity.image}
                alt={
                  activeAmenity.alt ||
                  (typeof activeAmenity.title === "string" ? activeAmenity.title : pick(lang, activeAmenity.title))
                }
              />
            ) : null}
            <p>{typeof activeAmenity.desc === "string" ? activeAmenity.desc : pick(lang, activeAmenity.desc)}</p>
            <div className="site-modal-actions">
              <button type="button" className="btn-text" onClick={() => setActiveAmenity(null)}>
                {lang === "vi" ? "Đóng" : "Close"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {galleryIndex != null && gallery[galleryIndex] ? (
        <div className="site-lightbox" onClick={() => setGalleryIndex(null)} role="presentation">
          <button
            type="button"
            className="site-lightbox-close"
            aria-label={lang === "vi" ? "Đóng ảnh" : "Close photo"}
            onClick={() => setGalleryIndex(null)}
          >
            ×
          </button>
          <img
            src={gallery[galleryIndex].src}
            alt={gallery[galleryIndex].alt || ""}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </main>
  );
}
