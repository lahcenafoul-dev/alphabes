import { describe, expect, it } from "vitest";
import { allStories, englishStories, frenchStories, portugueseStories, spanishStories } from "@/prisma/stories-data";

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

describe("stories (prisma/stories-data.ts)", () => {
  it("has 8 stories in each language, each with 5 pages", () => {
    for (const list of [englishStories, frenchStories, spanishStories, portugueseStories]) {
      expect(list).toHaveLength(8);
      for (const s of list) expect(s.pages.map((p) => p.pageNumber)).toEqual([1, 2, 3, 4, 5]);
    }
    expect(new Set(spanishStories.map((s) => s.locale))).toEqual(new Set(["ES"]));
    expect(new Set(portugueseStories.map((s) => s.locale))).toEqual(new Set(["PT"]));
  });

  it("gives every slug once across all languages", () => {
    const slugs = allStories.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("pairs each Spanish story with its English and French twins, same pictures", () => {
    for (const es of spanishStories) {
      for (const other of [englishStories, frenchStories]) {
        const twin = other.find((s) => s.translationGroup === es.translationGroup)!;
        expect(twin, es.slug).toBeDefined();
        expect(es.coverScene).toBe(twin.coverScene);
        expect(es.order).toBe(twin.order);
        expect(es.pages.map((p) => p.scene)).toEqual(twin.pages.map((p) => p.scene));
      }
    }
  });

  it("uses the slugs approved in the plan", () => {
    expect(spanishStories.map((s) => s.slug)).toEqual([
      "la-manzanita-roja",
      "bruno-el-osito-valiente",
      "mia-la-gatita-curiosa",
      "canelo-y-su-pelota",
      "lupita-la-patita-timida",
      "burbujas-el-pececito",
      "tito-el-buho-sabio",
      "la-siesta-de-leo",
    ]);
  });

  it("avoids words that change from one country to another, and vosotros", () => {
    const regional = [
      "carro", "coche", "platano", "banana", "fresa", "frutilla", "durazno", "melocoton", "jugo", "zumo",
      "pastel", "torta", "papa", "patata", "pina", "anana", "computadora", "ordenador", "coger", "cogio", "camion",
      "pasto", "cesped", "escondidas", "escondite", "vosotros", "podeis", "venid",
    ];
    for (const s of spanishStories) {
      const words = strip([s.title, ...s.pages.map((p) => p.text)].join(" ")).match(/\p{L}+/gu) ?? [];
      for (const w of words) expect(regional, `${s.slug}: ${w}`).not.toContain(w);
    }
  });

  it("opens Spanish questions and exclamations, and has no look-alike letters", () => {
    for (const s of spanishStories) {
      for (const p of s.pages) {
        expect(p.text.split("?").length, p.text).toBe(p.text.split("¿").length);
        expect(p.text.split("!").length, p.text).toBe(p.text.split("¡").length);
      }
    }
    expect(JSON.stringify(spanishStories)).not.toMatch(/[Ѐ-ӿ]|[Ͱ-Ͽ]/);
  });

  it("pairs each Portuguese story with its twins in the three other languages, same pictures", () => {
    for (const pt of portugueseStories) {
      for (const other of [englishStories, frenchStories, spanishStories]) {
        const twin = other.find((s) => s.translationGroup === pt.translationGroup)!;
        expect(twin, pt.slug).toBeDefined();
        expect(pt.coverScene).toBe(twin.coverScene);
        expect(pt.order).toBe(twin.order);
        expect(pt.pages.map((p) => p.scene)).toEqual(twin.pages.map((p) => p.scene));
      }
    }
  });

  it("uses the Portuguese slugs from the plan", () => {
    expect(portugueseStories.map((s) => s.slug)).toEqual([
      "a-macazinha-vermelha",
      "beto-o-ursinho-corajoso",
      "mimi-a-gatinha-curiosa",
      "toto-e-sua-bola",
      "lili-a-patinha-timida",
      "bolinha-o-peixinho",
      "juju-a-coruja-sabida",
      "a-soneca-do-leo",
    ]);
  });

  it("writes Brazilian Portuguese: no Portugal-only words or forms, no Spanish", () => {
    const notBrazilian = [
      "autocarro", "comboio", "frigorifico", "sumo", "gelado", "rapariga", "miudo", "relva", "casa-de-banho",
      "estou a", "esta a", "estava a", "vos", "vosso", "pequeno-almoco",
    ];
    const spanish = ["el", "la", "una", "muy", "dice", "pero", "niña", "niño", "cuento", "también"];
    for (const s of portugueseStories) {
      const text = strip([s.title, ...s.pages.map((p) => p.text)].join(" "));
      const words = text.match(/\p{L}+(?:-\p{L}+)*/gu) ?? [];
      for (const w of words) expect(notBrazilian, `${s.slug}: ${w}`).not.toContain(w);
      // Compared with the accents kept: Portuguese "lá" is not Spanish "la".
      const raw = [s.title, ...s.pages.map((p) => p.text)].join(" ").toLowerCase().match(/\p{L}+/gu) ?? [];
      for (const w of raw) expect(spanish, `${s.slug}: ${w}`).not.toContain(w);
      expect(raw, s.slug).not.toContain("bebé"); // Brazil writes bebê
      for (const phrase of notBrazilian.filter((x) => x.includes(" "))) expect(text, s.slug).not.toContain(phrase);
      expect(text, s.slug).not.toMatch(/[¿¡«»]/);
    }
    expect(JSON.stringify(portugueseStories)).not.toMatch(/[Ѐ-ӿ]|[Ͱ-Ͽ]/);
  });

  it("closes every Portuguese quotation it opens", () => {
    for (const s of portugueseStories) {
      for (const p of s.pages) expect(p.text.split("“").length, p.text).toBe(p.text.split("”").length);
    }
  });
});
