import { useOutletContext } from "react-router-dom";
import { useSiteContent } from "../site-content/useSiteContent.js";

function pick(lang, o) {
  if (!o || typeof o !== "object") return "";
  return lang === "vi" ? o.vi : o.en;
}

function AboutPage() {
  const { lang = "vi" } = useOutletContext() ?? {};
  const { content } = useSiteContent();
  const about = content.aboutPage || {};

  const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : [];
  const galleryImages =
    Array.isArray(about.galleryImages) && about.galleryImages.length
      ? about.galleryImages
      : [
          {
            src: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80",
            alt: "Suite",
          },
          {
            src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
            alt: "Restaurant",
          },
        ];

  const heroBg =
    about.heroImage ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80";

  return (
    <main className="page">
      <section
        className="hero"
        style={{
          backgroundImage: heroBg ? `url('${heroBg}')` : "none",
        }}
      >
        <div className="hero-overlay">
          <div className="container hero-inner">
            <h1>{about.heroTitle || "Hanh Trinh Cua Bliss Hotel"}</h1>
            <p>{about.heroSubtitle || "Tinh te, thanh lich va truong ton theo thoi gian."}</p>
          </div>
        </div>
      </section>

      <section className="container">
        <h2>{pick(lang, about.sectionTitle) || "Cau Chuyen Thuong Hieu"}</h2>
        <article>
          {paragraphs.length === 0 ? (
            <>
              <p>
                Bliss Hotel duoc xay dung voi triet ly "ca nhan hoa trong tung chi tiet". Chung toi ket hop luxury
                hospitality va gu tham my duong dai de tao mot trai nghiem luu tru khac biet.
              </p>
              <p>
                Tu check-in den dich vu concierge, moi diem cham deu duoc tinh chinh de mang lai cam giac thoai mai, yen
                tinh va dang cap cho moi du khach.
              </p>
            </>
          ) : (
            paragraphs.map((p, i) => <p key={i}>{pick(lang, p)}</p>)
          )}
        </article>

        {galleryImages.length > 0 ? (
          <div className="gallery-2" style={{ marginTop: "2rem" }}>
            {galleryImages.map((img, i) => (
              <img key={i} src={img.src} alt={img.alt || ""} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default AboutPage;
