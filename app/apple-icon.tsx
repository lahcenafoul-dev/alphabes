import { owlIconResponse } from "@/lib/owl-icon";

// The home-screen icon on iPhones and iPads: the owl at 180 px, square because
// iOS rounds the corners itself.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return owlIconResponse(180, { rounded: false });
}
