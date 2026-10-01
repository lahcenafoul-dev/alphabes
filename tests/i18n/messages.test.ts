import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import es from "@/messages/es.json";

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
  const others = [
    ["fr", flatten(fr as Tree)],
    ["es", flatten(es as Tree)],
  ] as const;

  it("have exactly the same keys in every language", () => {
    for (const [lang, flat] of others) expect(Object.keys(flat).sort(), lang).toEqual(Object.keys(flatEn).sort());
  });

  it("have the same value shapes (string vs list)", () => {
    for (const [lang, flat] of others) {
      for (const key of Object.keys(flatEn)) {
        expect(Array.isArray(flat[key]), `${lang}:${key}`).toBe(Array.isArray(flatEn[key]));
      }
    }
  });

  it("have no empty strings except where intended", () => {
    for (const [lang, flat] of [["en", flatEn], ...others] as const) {
      for (const [key, value] of Object.entries(flat)) {
        if (MAY_BE_EMPTY.has(key)) continue;
        const values = Array.isArray(value) ? value : [value];
        for (const v of values) expect(v.trim(), `${lang}:${key}`).not.toBe("");
      }
    }
  });

  it("use the same ICU placeholders in every language", () => {
    // Argument names only ("{name}" or "{count, plural, ...}"), not the text
    // inside plural branches.
    const placeholders = (s: string) => new Set([...s.matchAll(/\{\s*(\w+)\s*[,}]/g)].map((m) => m[1]));
    for (const [lang, flat] of others) {
      for (const [key, value] of Object.entries(flatEn)) {
        if (Array.isArray(value)) continue;
        expect([...placeholders(flat[key] as string)].sort(), `${lang}:${key}`).toEqual([...placeholders(value)].sort());
      }
    }
  });

  it("don't leave English text in the other files", () => {
    // Words that are the same in several languages are allowed.
    const sameInBoth = new Set([
      "English", "Français", "Español", "Blog", "Contact", "Message", "Alphabet", "Pro", "Menu", "AlphaBes", "Page {page}",
    ]);
    for (const [lang, flat] of others) {
      const suspicious = Object.entries(flat).filter(
        ([key, v]) => typeof v === "string" && v === flatEn[key] && /[a-z]{4,}/i.test(v) && !sameInBoth.has(v),
      );
      expect(suspicious, lang).toEqual([]);
    }
  });

  it("offer the same choices in ICU select messages", () => {
    // A child learning in Spanish needs an "ES" branch in every language.
    const branches = (s: string) => [...s.matchAll(/\b([A-Z]{2}|other) \{/g)].map((m) => m[1]).sort();
    for (const [lang, flat] of others) {
      for (const [key, value] of Object.entries(flatEn)) {
        if (typeof value !== "string" || !value.includes(", select,")) continue;
        expect(branches(flat[key] as string), `${lang}:${key}`).toEqual(branches(value));
      }
    }
  });
});
