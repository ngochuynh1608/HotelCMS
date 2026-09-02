import { useOutletContext, useSearchParams } from "react-router-dom";
import { useSiteContent } from "../site-content/useSiteContent.js";
import { SiteCta } from "../components/SiteCta.jsx";
import { BookingBar } from "../components/BookingBar.jsx";
import { BookingEngineEmbed } from "../components/BookingEngineEmbed.jsx";
import { getContactHref } from "../utils/contactLinks.js";

function pick(lang, o) {
  if (!o || typeof o !== "object") return "";
  return lang === "vi" ? o.vi : o.en;
}

function bookingScriptForLang(booking, lang) {
  if (lang === "en") return booking.scriptEn || booking.script || "";
  return booking.scriptVi || booking.script || "";
}

export default function ReservationPage() {
  const { lang = "vi" } = useOutletContext() ?? {};
  const { content } = useSiteContent();
  const [params] = useSearchParams();
  const booking = content.booking || {};
  const contact = content.contact || {};

  const title = lang === "vi" ? booking.titleVi || "Đặt phòng" : booking.titleEn || "Reservation";
  const subtitle =
    lang === "vi"
      ? booking.subtitleVi || "Nhập thông tin hoặc tiếp tục tới hệ thống đặt phòng."
      : booking.subtitleEn || "Fill in your details or continue to the booking engine.";

  const scriptHtml = bookingScriptForLang(booking, lang);
  const hasEmbed = Boolean(scriptHtml.trim());
  const hasBooking = Boolean(booking.link || hasEmbed);
  const checkin = params.get("checkin");
  const checkout = params.get("checkout");
  const guests = params.get("guests");
  const hasStay = Boolean(checkin || checkout || guests);

  return (
    <main className="page page-offset">
      <section className="container">
        <div className="section-head is-left">
          <p className="section-kicker">{lang === "en" ? "Reservation" : "Giữ phòng"}</p>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {hasStay ? (
          <p className="stay-summary">
            {lang === "vi" ? "Yêu cầu của bạn:" : "Your stay:"}{" "}
            {checkin || "—"} → {checkout || "—"}
            {guests ? ` · ${guests} ${lang === "vi" ? "khách" : "guests"}` : ""}
          </p>
        ) : null}
        {hasEmbed ? null : <BookingBar lang={lang} />}
        {hasEmbed ? <BookingEngineEmbed html={scriptHtml} kind="booking" /> : null}
        {booking.link && !hasEmbed ? (
          <p style={{ margin: "1.2rem 0" }}>
            <a className="btn btn-primary" href={booking.link} target="_blank" rel="noreferrer">
              {lang === "vi" ? "Mở trang đặt phòng" : "Open booking page"}
            </a>
          </p>
        ) : null}
        {!hasBooking ? (
          <div className="contact-wrap" style={{ marginTop: "2rem" }}>
            <div className="contact">
              <div className="booking-empty">
                <p>
                  {lang === "vi"
                    ? "Hệ thống đặt phòng trực tuyến sẽ sớm được kết nối. Vui lòng liên hệ lễ tân để giữ phòng theo ngày bạn đã chọn."
                    : "The online booking engine will be connected shortly. Please contact reception with the dates you selected."}
                </p>
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
                <p style={{ marginTop: "1.1rem" }}>
                  <SiteCta className="btn btn-primary" href="/#lien-he">
                    {lang === "vi" ? "Xem liên hệ" : "View contact"}
                  </SiteCta>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
