import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { alternatesFor, isAvailable, localizedPath } from "@/lib/i18n/routes";

describe("refund policy page", () => {
  it("exists in every language at its own URL", () => {
    expect(localizedPath("en", "/refunds")).toBe("/refunds");
    expect(localizedPath("fr", "/refunds")).toBe("/fr/remboursements");
    expect(localizedPath("es", "/refunds")).toBe("/es/reembolsos");
    expect(localizedPath("pt", "/refunds")).toBe("/pt/reembolsos");
    for (const l of routing.locales) expect(isAvailable(l, "/refunds"), l).toBe(true);
  });

  it("links its four versions with hreflang", () => {
    const { languages } = alternatesFor("fr", "/refunds");
    expect(languages).toMatchObject({
      en: "https://alphabes.com/refunds",
      fr: "https://alphabes.com/fr/remboursements",
      es: "https://alphabes.com/es/reembolsos",
      pt: "https://alphabes.com/pt/reembolsos",
    });
  });
});
