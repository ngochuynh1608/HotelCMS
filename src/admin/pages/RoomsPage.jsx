import { useEffect, useState } from "react";
import { Field } from "../components/Field.jsx";
import { MultiImageUploadField } from "../components/MultiImageUploadField.jsx";
import { useAdminDraft } from "../useAdminDraft.js";
import { IconToolbarTrash } from "../toolbarIcons.jsx";

const ROOM_AMENITY_PRESETS = [
  { id: "wifi", label: "Wifi miễn phí" },
  { id: "balcony", label: "Ban công riêng" },
  { id: "marble_bath", label: "Bồn tắm marble" },
  { id: "tv_minibar", label: "Smart TV + mini bar" },
];

const PRESET_IDS = new Set(ROOM_AMENITY_PRESETS.map((p) => p.id));

export default function RoomsPage() {
  const { draft, setDraft } = useAdminDraft();
  const rooms = draft.rooms || {};
  const items = rooms.items || [];

  const [customAmenityByIndex, setCustomAmenityByIndex] = useState({});
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [showAmenityTranslate, setShowAmenityTranslate] = useState(false);
  const [amenityTranslationsDraft, setAmenityTranslationsDraft] = useState(
    rooms.roomAmenityTranslationMap || {}
  );

  const anyAmenitiesSelected = items.some((r) => Array.isArray(r.roomAmenities) && r.roomAmenities.length > 0);

  useEffect(() => {
    if (anyAmenitiesSelected) setAmenitiesOpen(true);
  }, [anyAmenitiesSelected]);

  function updateRoom(index, patch) {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], ...patch };
    setDraft({ ...draft, rooms: { ...rooms, items: nextItems } });
  }

  function toggleAmenity(index, amenityId) {
    const current = Array.isArray(items[index]?.roomAmenities) ? items[index].roomAmenities : [];
    const checked = current.includes(amenityId);
    updateRoom(index, {
      roomAmenities: checked ? current.filter((x) => x !== amenityId) : [...current, amenityId],
    });
  }

  /** Gộp thư viện tiện ích tùy chỉnh + các nhãn đang dùng ở phòng (tương thích dữ liệu cũ). */
  function getCustomAmenityLabels() {
    const lib = Array.isArray(rooms.roomAmenityLibrary) ? [...rooms.roomAmenityLibrary] : [];
    const fromRooms = new Set();
    items.forEach((r) => {
      (r.roomAmenities || []).forEach((a) => {
        if (typeof a === "string" && a.trim() && !PRESET_IDS.has(a)) {
          fromRooms.add(a.trim());
        }
      });
    });
    const merged = [...new Set([...lib.map((x) => String(x).trim()).filter(Boolean), ...fromRooms])];
    merged.sort((a, b) => a.localeCompare(b, "vi"));
    return merged;
  }

  function addToRoomAmenityLibrary(label) {
    const v = String(label || "").trim();
    if (!v) return;
    const lib = Array.isArray(rooms.roomAmenityLibrary) ? [...rooms.roomAmenityLibrary] : [];
    const exists = lib.some((x) => String(x).trim().toLowerCase() === v.toLowerCase());
    if (!exists) lib.push(v);
    setDraft({ ...draft, rooms: { ...rooms, roomAmenityLibrary: lib } });
  }

  /** Xóa tiện ích tùy chỉnh khỏi thư viện và khỏi mọi phòng (preset có sẵn không xóa). */
  function removeCustomAmenityFromSite(label) {
    const v = String(label || "").trim();
    if (!v) return;
    if (PRESET_IDS.has(v)) return;
    const lib = Array.isArray(rooms.roomAmenityLibrary)
      ? rooms.roomAmenityLibrary.filter((x) => String(x).trim().toLowerCase() !== v.toLowerCase())
      : [];
    const nextItems = items.map((r) => ({
      ...r,
      roomAmenities: (r.roomAmenities || []).filter((x) => {
        if (typeof x !== "string") return true;
        return x.trim().toLowerCase() !== v.toLowerCase();
      }),
    }));
    setDraft({ ...draft, rooms: { ...rooms, roomAmenityLibrary: lib, items: nextItems } });
  }

  const customAmenityLabels = getCustomAmenityLabels();

  return (
    <div className="admin-panel">
      <h2>Danh sách phòng</h2>
      <div className="admin-fields">
        <div className="row2">
          <Field label="Tiêu đề (VI)">
            <input
              type="text"
              value={rooms.sectionTitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  rooms: { ...rooms, sectionTitle: { ...rooms.sectionTitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Tiêu đề (EN)">
            <input
              type="text"
              value={rooms.sectionTitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  rooms: { ...rooms, sectionTitle: { ...rooms.sectionTitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>
        <div className="row2">
          <Field label="Mô tả (VI)">
            <textarea
              value={rooms.sectionSubtitle?.vi || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  rooms: { ...rooms, sectionSubtitle: { ...rooms.sectionSubtitle, vi: e.target.value } },
                })
              }
            />
          </Field>
          <Field label="Mô tả (EN)">
            <textarea
              value={rooms.sectionSubtitle?.en || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  rooms: { ...rooms, sectionSubtitle: { ...rooms.sectionSubtitle, en: e.target.value } },
                })
              }
            />
          </Field>
        </div>

        {items.map((room, i) => {
          const roomImages =
            Array.isArray(room.images) && room.images.length
              ? room.images
              : room.image
                ? [{ src: room.image, alt: "" }]
                : [];

          const representative = room.image || "";
          const selectedAmenities = Array.isArray(room.roomAmenities) ? room.roomAmenities : [];
          const customText = customAmenityByIndex[i] || "";

          return (
            <div key={i} className="admin-item">
              <div className="admin-item-actions-top">
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => {
                    if (!window.confirm(`Xóa phòng ${i + 1}?`)) return;
                    const nextItems = items.filter((_, j) => j !== i);
                    setDraft({ ...draft, rooms: { ...rooms, items: nextItems } });
                  }}
                >
                  <span className="admin-btn-icon">
                    <IconToolbarTrash />
                  </span>
                  Xóa phòng
                </button>
              </div>

              <h4>Phòng {i + 1}</h4>

              <Field label="Tên phòng">
                <input
                  type="text"
                  value={room.name || ""}
                  onChange={(e) => updateRoom(i, { name: e.target.value })}
                />
              </Field>

              <Field label="Mô tả">
                <textarea
                  value={room.desc || ""}
                  onChange={(e) => updateRoom(i, { desc: e.target.value })}
                />
              </Field>

              <div className="row2">
                <Field label="Diện tích phòng (m2)">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={room.area || ""}
                    onChange={(e) => updateRoom(i, { area: e.target.value })}
                  />
                </Field>
                <Field label="Số giường">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={room.beds || ""}
                    onChange={(e) => updateRoom(i, { beds: e.target.value })}
                  />
                </Field>
              </div>

              <div className="row2">
                <Field label="Giá (VI)">
                  <input
                    type="text"
                    value={typeof room.price === "string" ? room.price : room.price?.vi || ""}
                    onChange={(e) =>
                      updateRoom(i, {
                        price: { ...(typeof room.price === "object" ? room.price : {}), vi: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Giá (EN)">
                  <input
                    type="text"
                    value={typeof room.price === "object" ? room.price?.en || "" : ""}
                    onChange={(e) =>
                      updateRoom(i, {
                        price: { ...(typeof room.price === "object" ? room.price : {}), en: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>

              <MultiImageUploadField
                label="Ảnh phòng (nhiều ảnh)"
                hint="Chọn 1 ảnh đại diện để hiển thị ở danh sách phòng & banner chi tiết."
                images={roomImages}
                representative={representative}
                accept="image/*"
                onChangeImages={(nextImages) => {
                  const nextRep =
                    representative && nextImages.some((im) => im.src === representative)
                      ? representative
                      : nextImages[0]?.src || "";
                  updateRoom(i, { images: nextImages, image: nextRep });
                }}
                onChangeRepresentative={(src) => {
                  updateRoom(i, { image: src });
                }}
              />

              <Field label="Tiện ích phòng">
                <details
                  className="admin-disclosure"
                  open={amenitiesOpen}
                  onToggle={(e) => setAmenitiesOpen(e.currentTarget.open)}
                >
                  <summary>Chọn tiện ích phòng</summary>
                  <div className="admin-amenity-picker">
                    <div className="admin-amenity-grid">
                      {ROOM_AMENITY_PRESETS.map((opt) => {
                        const checked = selectedAmenities.includes(opt.id);
                        return (
                          <label key={opt.id} className="admin-check">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleAmenity(i, opt.id)}
                            />
                            <span>{opt.label}</span>
                          </label>
                        );
                      })}
                      {customAmenityLabels.map((label) => {
                        const checked = selectedAmenities.includes(label);
                        return (
                          <div key={`custom-${label}`} className="admin-amenity-grid-item">
                            <label className="admin-check">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAmenity(i, label)}
                              />
                              <span>{label}</span>
                            </label>
                            <button
                              type="button"
                              className="admin-amenity-remove"
                              title="Xóa tiện ích khỏi thư viện và mọi phòng"
                              aria-label={`Xóa tiện ích ${label}`}
                              onClick={() => {
                                if (
                                  !window.confirm(
                                    `Xóa tiện ích "${label}" khỏi thư viện và khỏi tất cả phòng?`
                                  )
                                )
                                  return;
                                removeCustomAmenityFromSite(label);
                              }}
                            >
                              <IconToolbarTrash />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="admin-amenity-custom">
                      <input
                        type="text"
                        value={customText}
                        placeholder="Thêm tiện ích khác (vd: bồn tắm)"
                        onChange={(e) =>
                          setCustomAmenityByIndex((prev) => ({ ...prev, [i]: e.target.value }))
                        }
                      />
                      <button
                        type="button"
                        className="admin-btn"
                        onClick={() => {
                          const v = (customText || "").trim();
                          if (!v) return;
                          const current = Array.isArray(items[i]?.roomAmenities) ? items[i].roomAmenities : [];
                          if (current.includes(v)) {
                            setCustomAmenityByIndex((prev) => ({ ...prev, [i]: "" }));
                            return;
                          }
                          addToRoomAmenityLibrary(v);
                          updateRoom(i, { roomAmenities: [...current, v] });
                          setCustomAmenityByIndex((prev) => ({ ...prev, [i]: "" }));
                        }}
                      >
                        + Thêm
                      </button>
                      {customAmenityLabels.length > 0 ? (
                        <button
                          type="button"
                          className="admin-btn"
                          onClick={() => {
                            setAmenityTranslationsDraft(rooms.roomAmenityTranslationMap || {});
                            setShowAmenityTranslate(true);
                          }}
                        >
                          Dịch tiện ích
                        </button>
                      ) : null}
                    </div>
                  </div>
                </details>
              </Field>
            </div>
          );
        })}

        <button
          type="button"
          className="admin-btn"
          onClick={() =>
            setDraft({
              ...draft,
              rooms: {
                ...rooms,
                items: [
                  ...items,
                  { name: "", desc: "", price: "", image: "", images: [], roomAmenities: [], area: "", beds: "" },
                ],
              },
            })
          }
        >
          + Thêm phòng
        </button>
      </div>

      {showAmenityTranslate ? (
        <div className="admin-modal-backdrop" onClick={() => setShowAmenityTranslate(false)}>
          <div
            className="admin-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="admin-modal-header">
              <h3>Dịch tiện ích phòng sang tiếng Anh</h3>
            </div>
            <div className="admin-modal-body">
              {customAmenityLabels.length === 0 ? (
                <p style={{ fontSize: "0.85rem", color: "#5c5240" }}>
                  Chưa có tiện ích tùy chỉnh nào. Vui lòng thêm tiện ích trong phòng trước.
                </p>
              ) : (
                customAmenityLabels.map((label) => (
                  <div key={label} className="admin-amenity-translate-row">
                    <label>{label}</label>
                    <input
                      type="text"
                      placeholder="English label"
                      value={amenityTranslationsDraft?.[label] || ""}
                      onChange={(e) =>
                        setAmenityTranslationsDraft((prev) => ({
                          ...(prev || {}),
                          [label]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))
              )}
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn" onClick={() => setShowAmenityTranslate(false)}>
                Đóng
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => {
                  setDraft({
                    ...draft,
                    rooms: { ...rooms, roomAmenityTranslationMap: amenityTranslationsDraft || {} },
                  });
                  setShowAmenityTranslate(false);
                }}
              >
                Lưu dịch
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
