import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots.txt", () => {
  it("keeps the dashboard in every language, admin and the API out of crawls", () => {
    const [rules] = robots().rules as { userAgent: string; allow: string; disallow: string[] }[];
    expect(rules.allow).toBe("/");
    expect(rules.disallow).toEqual(["/dashboard", "/fr/tableau-de-bord", "/es/mi-cuenta", "/pt/minha-conta", "/admin", "/api/"]);
  });
});
