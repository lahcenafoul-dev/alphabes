import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { fromDbLocale, toDbLocale } from "@/lib/i18n/db-locale";
import { pickVoice } from "@/lib/speech";

const voice = (lang: string, name = `Voice ${lang}`) => ({ lang, name }) as SpeechSynthesisVoice;

describe("pickVoice for Spanish", () => {
  it("prefers Mexico, then US Spanish, then Latin America, then Spain", () => {
    const all = [voice("en-US"), voice("es-ES"), voice("es-AR"), voice("es-US"), voice("es-MX")];
    expect(pickVoice(all, "es")?.lang).toBe("es-MX");
    expect(pickVoice(all.filter((v) => v.lang !== "es-MX"), "es")?.lang).toBe("es-US");
    expect(pickVoice([voice("es-ES"), voice("es_CO")], "es")?.lang).toBe("es_CO");
    expect(pickVoice([voice("en-US"), voice("es-ES")], "es")?.lang).toBe("es-ES");
  });

  it("falls back to any Spanish voice, and never to another language", () => {
    expect(pickVoice([voice("es-GQ")], "es")?.lang).toBe("es-GQ");
    expect(pickVoice([voice("en-US"), voice("fr-FR")], "es")).toBeNull();
  });

  it("prefers a higher-quality voice within the best region", () => {
    expect(pickVoice([voice("es-MX", "Sabina"), voice("es-MX", "Google español de México")], "es")?.name).toBe(
      "Google español de México",
    );
  });

  it("keeps French and English choices as before", () => {
    expect(pickVoice([voice("es-MX"), voice("fr-CA"), voice("fr-FR")], "fr")?.lang).toBe("fr-FR");
    expect(pickVoice([voice("es-MX"), voice("en-GB")], "en")?.lang).toBe("en-GB");
  });
});

describe("database locale", () => {
  it("round-trips every site language", () => {
    for (const locale of routing.locales) expect(fromDbLocale(toDbLocale(locale))).toBe(locale);
    expect(toDbLocale("es")).toBe("ES");
  });
});
