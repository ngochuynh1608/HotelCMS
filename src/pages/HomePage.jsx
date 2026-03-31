import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { SocialIcons } from "../components/SocialIcons.jsx";
import { useSiteContent } from "../site-content/useSiteContent.js";
import { getRoomHref } from "../utils/roomUtils.js";

function pick(lang, o) {
  if (!o || typeof o !== "object") return "";
  return lang === "vi" ? o.vi : o.en;
}

function normalizeHref(h) {
  if (!h) return "/";
  if (h.startsWith("http")) return h;
  if (h.startsWith("/")) return h;
  if (h.startsWith("#")) return `/${h}`;
  return `/#${h}`;
}

export default function HomePage() {
  const { lang = "vi" } = useOutletContext() ?? {};
  const { content } = useSiteContent();
  const hero = content.hero || {};
  const slides = useMemo(
    () => (hero.slides?.length ? hero.slides : [{ type: "image", src: "", alt: "" }]),
    [hero.slides]
  );
  const slideMs = Math.max(2000, hero.slideIntervalMs || 6600);

  const [slideIdx, setSlideIdx] = useState(0);
  const [introIdx, setIntroIdx] = useState(0);
  const videoRefs = useRef({});

  const rooms = content.rooms?.items || [];
  const [roomIndex, setRoomIndex] = useState(0);
  const roomIdx = rooms.length ? roomIndex % rooms.length : 0;
  const roomCarouselRef = useRef(null);
  const ignoreCarouselScrollRef = useRef(false);
  const carouselScrollIdleRef = useRef(null);
  const carouselDragRef = useRef({
    dragging: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });
  const carouselDragMovedRef = useRef(false);
  const [carouselDragging, setCarouselDragging] = useState(false);

  useEffect(() => {
    if (rooms.length <= 1) return;
    const timer = window.setInterval(() => {
      setRoomIndex((v) => (v + 1) % rooms.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [rooms.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = window.setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), slideMs);
    return () => window.clearInterval(t);
  }, [slides.length, slideMs]);

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
  const introSlides = intro.sliderImages?.length
    ? intro.sliderImages
    : [{ src: "", alt: "" }];

  useEffect(() => {
    if (introSlides.length <= 1) return;
    const t = window.setInterval(() => setIntroIdx((i) => (i + 1) % introSlides.length), 6000);
    return () => window.clearInterval(t);
  }, [introSlides.length]);

  const scrollRoomCarouselTo = useCallback((index) => {
    const vp = roomCarouselRef.current;
    const slide = vp?.children[index];
    if (!vp || !slide || typeof slide.offsetLeft !== "number") return;
    ignoreCarouselScrollRef.current = true;
    vp.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    window.setTimeout(() => {
      ignoreCarouselScrollRef.current = false;
    }, 480);
  }, []);

  useEffect(() => {
    if (!rooms.length) return;
    scrollRoomCarouselTo(roomIdx);
  }, [roomIdx, rooms.length, scrollRoomCarouselTo]);

  const onRoomCarouselScroll = useCallback(() => {
    if (ignoreCarouselScrollRef.current) return;
    window.clearTimeout(carouselScrollIdleRef.current);
    carouselScrollIdleRef.current = window.setTimeout(() => {
      const vp = roomCarouselRef.current;
      if (!vp || !rooms.length) return;
      const scrollLeft = vp.scrollLeft;
      const slides = [...vp.children].filter((el) => el.classList?.contains("room-carousel-slide"));
      if (!slides.length) return;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((el, i) => {
        const d = Math.abs(el.offsetLeft - scrollLeft);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setRoomIndex((cur) => (best !== cur ? best : cur));
    }, 120);
  }, [rooms.length]);

  const onRoomCarouselPointerDown = useCallback((e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const vp = roomCarouselRef.current;
    if (!vp) return;
    const d = carouselDragRef.current;
    d.dragging = true;
    d.startX = e.clientX;
    d.scrollLeft = vp.scrollLeft;
    d.moved = false;
    setCarouselDragging(true);
    try {
      vp.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const onRoomCarouselPointerMove = useCallback((e) => {
    const d = carouselDragRef.current;
    if (!d.dragging) return;
    const vp = roomCarouselRef.current;
    if (!vp) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) {
      d.moved = true;
      carouselDragMovedRef.current = true;
    }
    vp.scrollLeft = d.scrollLeft - dx;
  }, []);

  const endRoomCarouselDrag = useCallback(
    (e) => {
      const d = carouselDragRef.current;
      if (!d.dragging) return;
      d.dragging = false;
      setCarouselDragging(false);
      const vp = roomCarouselRef.current;
      if (vp && e?.pointerId != null) {
        try {
          vp.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      if (d.moved) {
        onRoomCarouselScroll();
      }
    },
    [onRoomCarouselScroll]
  );

  const amenities = content.amenities?.items || [];
  const gallery = content.gallery?.images || [];
  const promotions = content.promotions?.items || [];
  const contact = content.contact || {};

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
          <p>{pick(lang, hero.subtitle)}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={normalizeHref(hero.primaryCta?.href)}>
              {pick(lang, { vi: hero.primaryCta?.vi, en: hero.primaryCta?.en })}
            </a>
            <a className="btn btn-ghost" href={normalizeHref(hero.secondaryCta?.href)}>
              {pick(lang, { vi: hero.secondaryCta?.vi, en: hero.secondaryCta?.en })}
            </a>
          </div>
        </div>
      </section>

      <section id="gioi-thieu" className="intro">
        <div className="container section-head">
          <h2>{pick(lang, intro.sectionTitle)}</h2>
        </div>
        <div className="container grid-2 intro-grid">
          <article className="intro-card">
            {(intro.paragraphs || []).map((p, idx) => (
              <p key={idx}>{pick(lang, p)}</p>
            ))}
          </article>
          <div className="intro-slider">
            {introSlides.map((img, i) => (
              <div
                key={i}
                className={`intro-slide ${i === introIdx ? "is-active" : ""}`}
                style={{
                  backgroundImage: img.src ? `url(${img.src})` : "none",
                }}
                role="img"
                aria-label={img.alt || ""}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="phong" className="container">
        <div className="section-head">
          <h2>{pick(lang, content.rooms?.sectionTitle)}</h2>
          <p>{pick(lang, content.rooms?.sectionSubtitle)}</p>
        </div>
        {rooms.length > 0 ? (
          <div className="room-slider">
            <div
              className={`room-carousel-viewport${carouselDragging ? " is-dragging" : ""}`}
              ref={roomCarouselRef}
              onScroll={onRoomCarouselScroll}
              onPointerDown={onRoomCarouselPointerDown}
              onPointerMove={onRoomCarouselPointerMove}
              onPointerUp={endRoomCarouselDrag}
              onPointerCancel={endRoomCarouselDrag}
              onLostPointerCapture={endRoomCarouselDrag}
            >
              {rooms.map((room, idx) => (
                <Link
                  key={room.name + idx}
                  className={`room-carousel-slide ${idx === roomIdx ? "is-active" : ""}`}
                  to={getRoomHref(room, idx)}
                  draggable={false}
                  onClick={(ev) => {
                    if (carouselDragMovedRef.current) {
                      ev.preventDefault();
                      carouselDragMovedRef.current = false;
                    }
                  }}
                >
                  <img src={room.image} alt={room.name} />
                  <div className="room-overlay">
                    <h3>{room.name}</h3>
                    <p>{room.desc}</p>
                    <span className="room-price">
                      {typeof room.price === "object" ? pick(lang, room.price) : room.price}
                    </span>
                  </div>
                </Link>
              ))}
              {rooms.length > 1 ? (
                <div className="room-carousel-end-spacer" aria-hidden />
              ) : null}
            </div>
            {rooms.length > 1 ? (
              <div className="room-controls room-controls-below">
                <button
                  className="room-arrow"
                  type="button"
                  aria-label={lang === "vi" ? "Phòng trước" : "Previous room"}
                  onClick={() => setRoomIndex((v) => (v - 1 + rooms.length) % rooms.length)}
                >
                  &#8249;
                </button>
                <button
                  className="room-arrow"
                  type="button"
                  aria-label={lang === "vi" ? "Phòng sau" : "Next room"}
                  onClick={() => setRoomIndex((v) => (v + 1) % rooms.length)}
                >
                  &#8250;
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section id="tien-ich" className="container">
        <div className="section-head">
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
        <div className="amenity-grid">
          {amenities.map((a) => (
            <article key={a.title} className="amenity">
              <img src={a.image} alt={a.alt || a.title} />
              <h3>{pick(lang, a.title)}</h3>
              <p>{pick(lang, a.desc)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="hinh-anh" className="container">
        <div className="section-head">
          <h2>{pick(lang, content.gallery?.sectionTitle)}</h2>
          <p>{pick(lang, content.gallery?.sectionSubtitle)}</p>
        </div>
        <div className="gallery-grid">
          {gallery.map((g, i) => (
            <img key={i} src={g.src} alt={g.alt || ""} />
          ))}
        </div>
      </section>

      <section id="promotions" className="container">
        <div className="section-head">
          <h2>{pick(lang, content.promotions?.sectionTitle)}</h2>
          <p>{pick(lang, content.promotions?.sectionSubtitle)}</p>
        </div>
        <div className="amenity-grid">
          {promotions.map((p) => (
            <article key={p.title} className="amenity">
              <img src={p.image} alt={p.alt || p.title} />
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="lien-he" className="container">
        <div className="section-head">
          <h2>{pick(lang, contact.sectionTitle)}</h2>
          <p>{pick(lang, contact.sectionSubtitle)}</p>
        </div>
        <div className="contact-wrap">
          <div className="contact">
            <h3>{pick(lang, contact.infoTitle)}</h3>
            {(contact.lines || []).map((line, i) => (
              <p key={i}>
                <strong>{pick(lang, line.label)}</strong> {line.value}
              </p>
            ))}
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
    </main>
  );
}
