import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingBar({ lang = "vi" }) {
  const navigate = useNavigate();
  const defaults = useMemo(() => {
    const inDate = new Date();
    const outDate = new Date();
    outDate.setDate(outDate.getDate() + 1);
    return { checkin: toISODate(inDate), checkout: toISODate(outDate) };
  }, []);
  const [checkin, setCheckin] = useState(defaults.checkin);
  const [checkout, setCheckout] = useState(defaults.checkout);
  const [guests, setGuests] = useState("2");

  function onSubmit(e) {
    e.preventDefault();
    const q = new URLSearchParams({ checkin, checkout, guests });
    navigate(`/reservation?${q.toString()}`);
  }

  return (
    <form className="booking-bar" onSubmit={onSubmit}>
      <label className="booking-field">
        <span>{lang === "en" ? "Check-in" : "Nhận phòng"}</span>
        <input type="date" value={checkin} min={defaults.checkin} onChange={(e) => setCheckin(e.target.value)} required />
      </label>
      <label className="booking-field">
        <span>{lang === "en" ? "Check-out" : "Trả phòng"}</span>
        <input type="date" value={checkout} min={checkin} onChange={(e) => setCheckout(e.target.value)} required />
      </label>
      <label className="booking-field">
        <span>{lang === "en" ? "Guests" : "Khách"}</span>
        <select value={guests} onChange={(e) => setGuests(e.target.value)}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <button className="btn btn-primary booking-submit" type="submit">
        {lang === "en" ? "Check availability" : "Đặt phòng"}
      </button>
    </form>
  );
}
