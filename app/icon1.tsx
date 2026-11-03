import { owlIconResponse } from "@/lib/owl-icon";

// The owl favicon at 16 px, drawn on a 16-pixel grid (see app/icon.tsx).
export const size = { width: 16, height: 16 };
export const contentType = "image/png";

export default function Icon() {
  return owlIconResponse(16);
}
