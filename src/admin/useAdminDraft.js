import { useContext } from "react";
import { AdminDraftContext } from "./draftContext.js";

export function useAdminDraft() {
  const ctx = useContext(AdminDraftContext);
  if (!ctx) throw new Error("useAdminDraft must be used inside AdminDraftProvider");
  return ctx;
}
