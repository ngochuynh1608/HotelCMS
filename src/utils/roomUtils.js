export function toRoomSlug(name, idx = 0) {
  const base = String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `room-${idx + 1}`;
}

export function getRoomId(room, idx = 0) {
  if (room?.id) return String(room.id);
  return toRoomSlug(room?.name, idx);
}

export function getRoomHref(room, idx = 0) {
  return `/room-detail/${getRoomId(room, idx)}`;
}

