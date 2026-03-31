export function Field({ label, children, hint }) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {children}
      {hint ? <small className="admin-field-hint">{hint}</small> : null}
    </label>
  );
}
