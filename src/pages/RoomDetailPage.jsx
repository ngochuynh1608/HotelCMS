import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useSiteContent } from "../site-content/useSiteContent.js";
import { getRoomHref, getRoomId } from "../utils/roomUtils.js";

const AMENITY_LABELS = {
  wifi: { vi: "Wifi miễn phí", en: "Complimentary Wi‑Fi" },
  balcony: { vi: "Ban công riêng", en: "Private balcony" },
  marble_bath: { vi: "Bồn tắm marble", en: "Marble bathtub" },
  tv_minibar: { vi: "Smart TV + mini bar", en: "Smart TV & minibar" },
};

function pick(lang, o) {
  if (!o || typeof o !== "object") return "";
  return lang === "vi" ? o.vi : o.en;
}

function resolveRoomImages(room) {
  if (Array.isArray(room?.images) && room.images.length > 0) {
    return room.images.map((x) => (typeof x === "string" ? { src: x, alt: room?.name || "" } : x));
  }
  return room?.image ? [{ src: room.image, alt: room?.name || "" }] : [];
}

export default function RoomDetailPage() {
  const { roomId } = useParams();
  const { lang = "vi" } = useOutletContext() ?? {};
  const { content } = useSiteContent();
  const roomsConfig = content.rooms || {};
  const rooms = roomsConfig.items || [];
  const amenityTranslations = roomsConfig.roomAmenityTranslationMap || {};

  const currentIndex = useMemo(() => {
    if (!rooms.length) return -1;
    if (!roomId) return 0;
    const idx = rooms.findIndex((r, i) => getRoomId(r, i) === roomId);
    return idx >= 0 ? idx : 0;
  }, [roomId, rooms]);

  const room = currentIndex >= 0 ? rooms[currentIndex] : null;
  const [thumbStart, setThumbStart] = useState(0);
  const images = resolveRoomImages(room);
  const roomAmenities = Array.isArray(room?.roomAmenities) ? room.roomAmenities : [];
  const features = [
    room?.area ? `${lang === "vi" ? "Diện tích" : "Area"}: ${room.area} m2` : null,
    room?.beds ? `${lang === "vi" ? "Số giường" : "Beds"}: ${room.beds}` : null,
    ...roomAmenities.map((x) => {
      const preset = AMENITY_LABELS[x];
      if (preset) return pick(lang, preset);
      if (typeof x === "string" && lang === "en") {
        const t = amenityTranslations[x];
        if (t && typeof t === "string") return t;
      }
      return x;
    }),
  ].filter(Boolean);

  if (!room) {
    return (
      <main className="page">
        <section className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
          <h2>{lang === "vi" ? "Chưa có dữ liệu phòng" : "No room data yet"}</h2>
          <p>{lang === "vi" ? "Vui lòng thêm phòng trong Admin CMS." : "Please add rooms in Admin CMS."}</p>
          <Link className="btn btn-primary" to="/">
            {lang === "vi" ? "Về trang chủ" : "Back to home"}
          </Link>
        </section>
      </main>
    );
  }

  const heroImage = room.image || images[0]?.src || "";
  const visibleThumbCount = Math.min(rooms.length, 4);
  const visibleRooms = Array.from({ length: visibleThumbCount }, (_, offset) => {
    const idx = (thumbStart + offset) % rooms.length;
    return { room: rooms[idx], idx };
  });

  useEffect(() => {
    if (currentIndex >= 0) setThumbStart(currentIndex);
  }, [currentIndex]);

  return (
    <main className="page">
      <section
        className="hero"
        style={{
          backgroundImage: heroImage ? `url('${heroImage}')` : "none",
        }}
      >
        <div className="hero-overlay">
          <div className="container hero-inner">
            <h1>{room.name || (lang === "vi" ? "Chi tiết phòng" : "Room details")}</h1>
            <p>{room.desc || ""}</p>
          </div>
        </div>
      </section>

      <section className="container">
        <h2>{lang === "vi" ? "Chi tiết phòng" : "Room details"}</h2>
        <div className="grid-2">
          <article>
            <p>{room.desc || ""}</p>
            <div className="features">
              {features.map((f, i) => (
                <div className="card" key={i}>
                  {f}
                </div>
              ))}
            </div>
            {room.price ? (
              <p style={{ marginTop: "1rem", fontWeight: 700 }}>
                {typeof room.price === "object" ? pick(lang, room.price) : room.price}
              </p>
            ) : null}
          </article>
          <div className="gallery-2">
            {images.map((img, i) => (
              <img key={img.src + i} src={img.src} alt={img.alt || room.name || ""} />
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 0 }}>
        {rooms.length > visibleThumbCount ? (
          <div className="room-controls room-controls-inline">
            <button
              className="room-arrow"
              type="button"
              onClick={() => setThumbStart((v) => (v - 1 + rooms.length) % rooms.length)}
              aria-label={lang === "vi" ? "Xem phòng trước" : "Previous rooms"}
            >
              &#8249;
            </button>
            <button
              className="room-arrow"
              type="button"
              onClick={() => setThumbStart((v) => (v + 1) % rooms.length)}
              aria-label={lang === "vi" ? "Xem phòng tiếp theo" : "Next rooms"}
            >
              &#8250;
            </button>
          </div>
        ) : null}
        <div className="room-thumbs room-thumbs-inline">
          {visibleRooms.map(({ room: r, idx }) => (
            <Link
              key={(r.name || "room") + idx}
              className={`room-thumb ${idx === currentIndex ? "is-active" : ""}`}
              to={getRoomHref(r, idx)}
            >
              <img src={r.image || resolveRoomImages(r)[0]?.src || ""} alt={r.name || ""} />
              <div className="room-thumb-meta">
                <h4>{r.name || (lang === "vi" ? `Phòng ${idx + 1}` : `Room ${idx + 1}`)}</h4>
                {r.desc ? <p>{r.desc}</p> : null}
                {r.price ? (
                  <span className="room-thumb-price">
                    {typeof r.price === "object" ? pick(lang, r.price) : r.price}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
