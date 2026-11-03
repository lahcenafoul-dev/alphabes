import { owlIconResponse } from "@/lib/owl-icon";

// The owl favicon (lib/owl-icon.tsx), 32 px. Its siblings, each a static file:
// icon1 (16 px, its own pixel drawing), icon2 and icon3 (192 and 512 px, for
// the web app manifest).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return owlIconResponse(32);
}
