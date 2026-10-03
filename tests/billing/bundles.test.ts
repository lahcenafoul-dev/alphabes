import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { fichePacks } from "@/lib/fiches-fr";
import { fichaPacks } from "@/lib/fichas-es";
import { atividadePacks } from "@/lib/atividades-pt";
import { bundles } from "@/lib/worksheet-bundles";
import { PRO_FILES_DIR, bundleDownloadUrl, bundleExists, bundleKey, readProFile } from "@/lib/billing/bundles";

const SLUGS = {
  en: bundles.map((b) => b.slug),
  fr: fichePacks.map((p) => p.slug),
  es: fichaPacks.map((p) => p.slug),
  pt: atividadePacks.map((p) => p.slug),
} as const;

describe("bundle files (pro-files/, uploaded to the private bucket)", () => {
  it("has exactly one file per bundle, at the key the route reads", () => {
    for (const [locale, slugs] of Object.entries(SLUGS) as [keyof typeof SLUGS, readonly string[]][]) {
      const expected = slugs.map((s) => bundleKey(locale, s).split("/")[1]).sort();
      const onDisk = readdirSync(join(PRO_FILES_DIR, locale)).sort();
      expect(onDisk, `${locale}: run the generator, or remove stale files`).toEqual(expected);
    }
  });

  it("pack data points at the same files", () => {
    for (const p of fichePacks) expect(p.file).toBe(`${PRO_FILES_DIR}/${bundleKey("fr", p.slug)}`);
    for (const p of fichaPacks) expect(p.file).toBe(`${PRO_FILES_DIR}/${bundleKey("es", p.slug)}`);
    for (const p of atividadePacks) expect(p.file).toBe(`${PRO_FILES_DIR}/${bundleKey("pt", p.slug)}`);
  });

  it("knows which bundles exist in which language", () => {
    expect(bundleExists("en", "letter-a-bundle")).toBe(true);
    expect(bundleExists("fr", "pack-lettre-a")).toBe(true);
    expect(bundleExists("fr", "letter-a-bundle")).toBe(false);
    expect(bundleExists("es", "paquete-letra-a")).toBe(true);
    expect(bundleExists("pt", "pacote-letra-a")).toBe(true);
    expect(bundleExists("pt", "paquete-letra-a")).toBe(false);
    expect(bundleDownloadUrl("fr", "pack-lettre-a")).toBe("/api/bundles/fr/pack-lettre-a");
  });

  it("reads the local folder under next dev only", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const file = await readProFile(bundleKey("fr", "pack-lettre-a"));
    expect(file?.size).toBeGreaterThan(10_000);
    expect(await readProFile("fr/does-not-exist.pdf")).toBeNull();
    vi.stubEnv("NODE_ENV", "production");
    expect(await readProFile(bundleKey("fr", "pack-lettre-a"))).toBeNull();
    vi.unstubAllEnvs();
  });

  it("left no pack PDF in public/", () => {
    for (const dir of ["fiches-pdf/packs", "fichas-pdf/paquetes", "atividades-pdf/pacotes"]) {
      expect(existsSync(join("public", dir)), dir).toBe(false);
    }
  });
});
