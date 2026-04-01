import { Field } from "../components/Field.jsx";
import { useAdminDraft } from "../useAdminDraft.js";

export default function BookingPage() {
  const { draft, setDraft } = useAdminDraft();
  const booking = draft.booking || {};

  return (
    <div className="admin-panel">
      <h2>Booking setting</h2>
      <div className="admin-fields">
        <div className="row2">
          <Field label="Tiêu đề (VI)">
            <input
              type="text"
              value={booking.titleVi || ""}
              onChange={(e) => setDraft({ ...draft, booking: { ...booking, titleVi: e.target.value } })}
            />
          </Field>
          <Field label="Tiêu đề (EN)">
            <input
              type="text"
              value={booking.titleEn || ""}
              onChange={(e) => setDraft({ ...draft, booking: { ...booking, titleEn: e.target.value } })}
            />
          </Field>
        </div>
        <div className="row2">
          <Field label="Mô tả (VI)">
            <textarea
              value={booking.subtitleVi || ""}
              onChange={(e) => setDraft({ ...draft, booking: { ...booking, subtitleVi: e.target.value } })}
            />
          </Field>
          <Field label="Mô tả (EN)">
            <textarea
              value={booking.subtitleEn || ""}
              onChange={(e) => setDraft({ ...draft, booking: { ...booking, subtitleEn: e.target.value } })}
            />
          </Field>
        </div>

        <Field label="Link booking (URL)">
          <input
            type="url"
            placeholder="https://booking.example.com/..."
            value={booking.link || ""}
            onChange={(e) => setDraft({ ...draft, booking: { ...booking, link: e.target.value } })}
          />
        </Field>

        <Field label="Script Booking (HTML/JS embed)">
          <textarea
            rows={8}
            placeholder='<script src="..."></script>'
            value={booking.script || ""}
            onChange={(e) => setDraft({ ...draft, booking: { ...booking, script: e.target.value } })}
          />
        </Field>
      </div>
    </div>
  );
}

