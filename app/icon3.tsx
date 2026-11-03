import { owlIconResponse } from "@/lib/owl-icon";

// The owl icon at 512 px for the manifest, square: Android rounds it (see app/icon.tsx).
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return owlIconResponse(512, { rounded: false });
}
