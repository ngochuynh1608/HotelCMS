const SESSION_OK = "bliss_admin_ok";
const SESSION_KEY = "bliss_admin_key";

export function isAdminLoggedIn() {
  return sessionStorage.getItem(SESSION_OK) === "1";
}

export function getAdminKey() {
  return sessionStorage.getItem(SESSION_KEY) || "";
}

export function setAdminSession(key) {
  sessionStorage.setItem(SESSION_OK, "1");
  sessionStorage.setItem(SESSION_KEY, key);
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_OK);
  sessionStorage.removeItem(SESSION_KEY);
}
