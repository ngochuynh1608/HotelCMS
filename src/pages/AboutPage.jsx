import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useSiteContent } from "../site-content/useSiteContent.js";

function pick(lang, o) {
  if (!o || typeof o !== "object") return "";
  return lang === "vi" ? o.vi : o.en;
}

function AboutPage() {
  const { lang = "en" } = useOutletContext() ?? {};
  const { content } = useSiteContent();
  const about = content.aboutPage || {};

  const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : [];
  const galleryImages = Array.isArray(about.galleryImages) ? about.galleryImages : [];
  const heroBg = about.heroImage || "";
  const textBlocks = paragraphs.map((p) => pick(lang, p)).filter(Boolean);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page">
      <section
        className="hero hero-compact"
        style={{
          backgroundImage: heroBg ? `url('${heroBg}')` : "none",
        }}
      >
        <div className="hero-overlay">
          <div className="container hero-inner">
            <p className="section-kicker" style={{ color: "rgba(244,239,230,0.85)" }}>
              {lang === "en" ? "About" : "Về chúng tôi"}
            </p>
            <h1>{about.heroTitle || "Grand Sunrise Palace"}</h1>
            <p>{about.heroSubtitle || ""}</p>
          </div>
        </div>
      </section>

      <section className="container intro-editorial">
        <p className="section-kicker">{lang === "en" ? "The palace" : "Câu chuyện"}</p>
        <h2>{pick(lang, about.sectionTitle) || (lang === "en" ? "Brand story" : "Câu chuyện thương hiệu")}</h2>
        <div className="intro-split">
          <article className="prose">
            {textBlocks.length === 0 ? (
              <p>
                {lang === "en"
                  ? "Grand Sunrise Palace Hoi An is a five-star Indochine hotel a few minutes from the Ancient Town and the beach."
                  : "Grand Sunrise Palace Hội An là khách sạn 5 sao phong cách Đông Dương, cách phố cổ và biển vài phút đi xe."}
              </p>
            ) : (
              textBlocks.map((p, i) => <p key={i}>{p}</p>)
            )}
          </article>
          {galleryImages[0]?.src ? (
            <figure className="intro-figure">
              <img src={galleryImages[0].src} alt={galleryImages[0].alt || ""} />
            </figure>
          ) : null}
        </div>
        {galleryImages.length > 1 ? (
          <div className="gallery-2" style={{ marginTop: "2rem" }}>
            {galleryImages.slice(1).map((img, i) => (
              <img key={i} src={img.src} alt={img.alt || ""} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default AboutPage;
