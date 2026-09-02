import { Field } from "../components/Field.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function BookingPage() {
  const { draft, setDraft } = useAdminDraft();
  const booking = draft.booking || {};

  function patch(next) {
    setDraft({ ...draft, booking: { ...booking, ...next } });
  }

  return (
    <div className="admin-panel">
      <h2>Booking setting</h2>
      <div className="admin-fields">
        <div className="row2">
          <Field label="Tiêu đề (VI)">
            <input type="text" value={booking.titleVi || ""} onChange={(e) => patch({ titleVi: e.target.value })} />
          </Field>
          <Field label="Tiêu đề (EN)">
            <input type="text" value={booking.titleEn || ""} onChange={(e) => patch({ titleEn: e.target.value })} />
          </Field>
        </div>
        <div className="row2">
          <Field label="Mô tả (VI)">
            <textarea value={booking.subtitleVi || ""} onChange={(e) => patch({ subtitleVi: e.target.value })} />
          </Field>
          <Field label="Mô tả (EN)">
            <textarea value={booking.subtitleEn || ""} onChange={(e) => patch({ subtitleEn: e.target.value })} />
          </Field>
        </div>

        <Field label="Link booking (URL)" hint="Tuỳ chọn. Dùng khi chưa nhúng Code BE.">
          <input
            type="url"
            placeholder="https://booking.example.com/..."
            value={booking.link || ""}
            onChange={(e) => patch({ link: e.target.value })}
          />
        </Field>

        <Field
          label="Code BE – Việt"
          hint="Dán nguyên đoạn HTML/JS (hbe-bws + widget.all.js + widgetCustomize lang=vi)."
        >
          <textarea
            className="admin-code"
            rows={8}
            spellCheck={false}
            placeholder='<div class="hbe-bws">...</div><script src="//book.securebookings.net/..."></script>'
            value={booking.scriptVi || ""}
            onChange={(e) => patch({ scriptVi: e.target.value })}
          />
        </Field>

        <Field
          label="Code BE – English"
          hint="Dán nguyên đoạn HTML/JS, lang=en."
        >
          <textarea
            className="admin-code"
            rows={8}
            spellCheck={false}
            placeholder='<div class="hbe-bws">...</div><script src="//book.securebookings.net/..."></script>'
            value={booking.scriptEn || ""}
            onChange={(e) => patch({ scriptEn: e.target.value })}
          />
        </Field>

        <Field
          label="Code search widget – Việt"
          hint="Widget tìm phòng trên trang chủ (search-wdg.css + widget.search.js, lang=vi)."
        >
          <textarea
            className="admin-code"
            rows={6}
            spellCheck={false}
            placeholder='<section id="hbe-bws-wrapper-widget-code"></section><script src="//book.securebookings.net/..."></script>'
            value={booking.searchScriptVi || ""}
            onChange={(e) => patch({ searchScriptVi: e.target.value })}
          />
        </Field>

        <Field
          label="Code search widget – English"
          hint="Widget tìm phòng trên trang chủ, lang=en."
        >
          <textarea
            className="admin-code"
            rows={6}
            spellCheck={false}
            placeholder='<section id="hbe-bws-wrapper-widget-code"></section><script src="//book.securebookings.net/..."></script>'
            value={booking.searchScriptEn || ""}
            onChange={(e) => patch({ searchScriptEn: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}
