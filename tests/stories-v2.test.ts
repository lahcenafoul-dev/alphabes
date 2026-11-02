import { describe, expect, it } from "vitest";
import { LEVEL_PAGES, storiesV2, type Lang } from "@/prisma/stories-v2";
import { charactersIn } from "@/scripts/stories/characters";

const LANGS: Lang[] = ["EN", "FR", "ES", "PT"];
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const all = (lang: Lang) => storiesV2.map((s) => s.text[lang]);
const words = (s: string) => s.match(/\p{L}+(?:-\p{L}+)*/gu) ?? [];

describe("stories v2 (prisma/stories-v2)", () => {
  it("has 24 stories, 8 per level, 16 of them new", () => {
    expect(storiesV2).toHaveLength(24);
    for (const level of [1, 2, 3]) expect(storiesV2.filter((s) => s.level === level)).toHaveLength(8);
    expect(storiesV2.filter((s) => s.isNew)).toHaveLength(16);
    expect(new Set(storiesV2.map((s) => s.group)).size).toBe(24);
  });

  it("gives every language the same page count, set by the level", () => {
    for (const s of storiesV2) {
      expect(s.scenes, s.group).toHaveLength(LEVEL_PAGES[s.level]);
      for (const lang of LANGS) {
        const t = s.text[lang];
        expect(t.pages, `${s.group} ${lang}`).toHaveLength(LEVEL_PAGES[s.level]);
        expect(t.questions.length, `${s.group} ${lang}`).toBeGreaterThanOrEqual(2);
        expect(t.questions.length, `${s.group} ${lang}`).toBeLessThanOrEqual(3);
        expect(t.description.length, `${s.group} ${lang}`).toBeLessThanOrEqual(180);
        for (const text of [t.title, t.description, ...t.pages, ...t.questions]) expect(text.trim(), s.group).not.toBe("");
      }
    }
  });

  it("keeps the 8 existing slugs and translation groups", () => {
    const kept = Object.fromEntries(storiesV2.filter((s) => !s.isNew).map((s) => [s.group, LANGS.map((l) => s.text[l].slug)]));
    expect(kept).toEqual({
      apple: ["the-little-apple", "la-petite-pomme", "la-manzanita-roja", "a-macazinha-vermelha"],
      dog: ["the-little-dog", "filou-et-sa-balle", "canelo-y-su-pelota", "toto-e-sua-bola"],
      fish: ["the-happy-fish", "pilou-le-poisson", "burbujas-el-pececito", "bolinha-o-peixinho"],
      duck: ["the-shy-duck", "coline-la-cane-timide", "lupita-la-patita-timida", "lili-a-patinha-timida"],
      lion: ["the-lions-nap", "la-sieste-de-leon", "la-siesta-de-leo", "a-soneca-do-leo"],
      bear: ["brave-little-bear", "titou-l-ourson-courageux", "bruno-el-osito-valiente", "beto-o-ursinho-corajoso"],
      cat: ["the-curious-cat", "moustache-le-chat-curieux", "mia-la-gatita-curiosa", "mimi-a-gatinha-curiosa"],
      owl: ["the-wise-owl", "hugo-le-hibou", "tito-el-buho-sabio", "juju-a-coruja-sabida"],
    });
  });

  it("gives every slug once across all languages, in URL form", () => {
    const slugs = LANGS.flatMap((l) => all(l).map((t) => t.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("names at least one cast character in every picture scene", () => {
    for (const s of storiesV2) {
      for (const scene of [s.cover, ...s.scenes]) expect(charactersIn(scene).length, `${s.group}: ${scene}`).toBeGreaterThan(0);
    }
  });

  it("writes neutral Spanish: no regional words, no vosotros, ¿ ¡ opened", () => {
    // Same list as tests/i18n/stories.test.ts.
    const regional = [
      "carro", "coche", "platano", "banana", "fresa", "frutilla", "durazno", "melocoton", "jugo", "zumo",
      "pastel", "torta", "papa", "patata", "pina", "anana", "computadora", "ordenador", "coger", "cogio", "camion",
      "pasto", "cesped", "escondidas", "escondite", "vosotros", "podeis", "venid",
      "guisante", "chicharo", "arveja", "elote", "choclo", "jalar", "jala", "desvan",
    ];
    for (const t of all("ES")) {
      for (const w of words(strip([t.title, t.description, ...t.pages, ...t.questions].join(" ")))) {
        expect(regional, `${t.slug}: ${w}`).not.toContain(w);
      }
      for (const p of [t.title, ...t.pages, ...t.questions]) {
        expect(p.split("?").length, p).toBe(p.split("¿").length);
        expect(p.split("!").length, p).toBe(p.split("¡").length);
        expect(p.split("«").length, p).toBe(p.split("»").length);
      }
    }
  });

  it("writes Brazilian Portuguese: no Portugal-only words or Spanish, quotes closed", () => {
    // Same lists as tests/i18n/stories.test.ts.
    const notBrazilian = [
      "autocarro", "comboio", "frigorifico", "sumo", "gelado", "rapariga", "miudo", "relva", "casa-de-banho",
      "estou a", "esta a", "estava a", "vos", "vosso", "pequeno-almoco",
    ];
    const spanish = ["el", "la", "una", "muy", "dice", "pero", "niña", "niño", "cuento", "también"];
    for (const t of all("PT")) {
      const raw = [t.title, t.description, ...t.pages, ...t.questions].join(" ");
      const text = strip(raw);
      for (const w of words(text)) expect(notBrazilian, `${t.slug}: ${w}`).not.toContain(w);
      for (const phrase of notBrazilian.filter((x) => x.includes(" "))) expect(text, t.slug).not.toContain(phrase);
      for (const w of raw.toLowerCase().match(/\p{L}+/gu) ?? []) expect(spanish, `${t.slug}: ${w}`).not.toContain(w);
      expect(raw).not.toMatch(/[¿¡«»]/);
      for (const p of t.pages) expect(p.split("“").length, p).toBe(p.split("”").length);
    }
  });

  it("uses French quotes and spaces before ! ? : in French", () => {
    for (const t of all("FR")) {
      for (const p of [t.title, ...t.pages, ...t.questions]) {
        expect(p, t.slug).not.toMatch(/\S[!?:;]/);
        expect(p.split("«").length, p).toBe(p.split("»").length);
        expect(p, t.slug).not.toMatch(/[“”"]/);
      }
    }
  });

  it("has no look-alike letters from other alphabets", () => {
    expect(JSON.stringify(storiesV2)).not.toMatch(/[Ѐ-ӿ]|[Ͱ-Ͽ]/);
  });
});
