import { owlIconResponse } from "@/lib/owl-icon";

// The owl icon at 192 px for the manifest, square: Android rounds it (see app/icon.tsx).
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return owlIconResponse(192, { rounded: false });
}
