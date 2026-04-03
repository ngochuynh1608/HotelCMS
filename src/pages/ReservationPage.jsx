import { useOutletContext } from "react-router-dom";
import { useSiteContent } from "../site-content/useSiteContent.js";

export default function ReservationPage() {
  const { lang = "vi" } = useOutletContext() ?? {};
  const { content } = useSiteContent();
  const booking = content.booking || {};

  const title = lang === "vi" ? booking.titleVi || "Đặt phòng" : booking.titleEn || "Reservation";
  const subtitle =
    lang === "vi"
      ? booking.subtitleVi || "Nhập thông tin hoặc tiếp tục tới hệ thống đặt phòng."
      : booking.subtitleEn || "Fill in your details or continue to the booking engine.";

  const scriptHtml = booking.script || "";

  return (
    <main className="page">
      <section className="container">
        <div className="section-head">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <div className="contact-wrap">
          <div className="contact">
            {booking.link ? (
              <p style={{ marginBottom: "1rem" }}>
                <a className="btn btn-primary" href={booking.link} target="_blank" rel="noreferrer">
                  {lang === "vi" ? "Mở trang đặt phòng" : "Open booking page"}
                </a>
              </p>
            ) : null}
            {scriptHtml ? (
              <div
                className="booking-embed"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: scriptHtml }}
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

