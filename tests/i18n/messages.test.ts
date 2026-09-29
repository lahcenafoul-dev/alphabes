import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

type Tree = { [key: string]: string | string[] | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string" || Array.isArray(value)) out[path] = value;
    else Object.assign(out, flatten(value, path));
  }
  return out;
}

// Keys that are intentionally empty in one language (e.g. a note only French needs).
const MAY_BE_EMPTY = new Set(["Pricing.currencyNote", "Pricing.free.period"]);

describe("message files", () => {
  const flatEn = flatten(en as Tree);
  const flatFr = flatten(fr as Tree);

  it("have exactly the same keys in English and French", () => {
    expect(Object.keys(flatFr).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it("have the same value shapes (string vs list)", () => {
    for (const key of Object.keys(flatEn)) {
      expect(Array.isArray(flatFr[key]), key).toBe(Array.isArray(flatEn[key]));
    }
  });

  it("have no empty strings except where intended", () => {
    for (const [lang, flat] of [["en", flatEn], ["fr", flatFr]] as const) {
      for (const [key, value] of Object.entries(flat)) {
        if (MAY_BE_EMPTY.has(key)) continue;
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) expect(v.trim(), `${lang}:${key}`).not.toBe("");
      }
    }
  });

  it("use the same ICU placeholders in both languages", () => {
    // Argument names only ("{name}" or "{count, plural, ...}"), not the text
    // inside plural branches.
    const placeholders = (s: string) => new Set([...s.matchAll(/\{\s*(\w+)\s*[,}]/g)].map((m) => m[1]));
    for (const [key, value] of Object.entries(flatEn)) {
      if (Array.isArray(value)) continue;
      const enP = placeholders(value);
      const frP = placeholders(flatFr[key] as string);
      expect([...frP].sort(), key).toEqual([...enP].sort());
    }
  });

  it("don't leave English text in the French file", () => {
    // Words that are the same in both languages are allowed.
    const sameInBoth = new Set(["English", "Français", "Blog", "Contact", "Message", "Alphabet", "Pro", "Menu", "AlphaBes", "Page {page}"]);
    const suspicious = Object.entries(flatFr).filter(
      ([key, v]) => typeof v === "string" && v === flatEn[key] && /[a-z]{4,}/i.test(v) && !sameInBoth.has(v),
    );
    expect(suspicious).toEqual([]);
  });
});
