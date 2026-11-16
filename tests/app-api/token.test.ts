import { encode } from "next-auth/jwt";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { APP_TOKEN_MAX_AGE, createAppToken, passwordFingerprint, readAppToken } from "@/lib/app-api/token";

// The mobile app's token (lib/app-api/token.ts).
describe("app token", () => {
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_SECRET", "test-secret-for-the-app-token-0123456789");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  const user = { id: "user_1", passwordHash: "$2a$10$abcdefghijklmnopqrstuv" };

  it("round-trips the user id and the password fingerprint", async () => {
    const token = await createAppToken(user);
    expect(await readAppToken(token)).toEqual({ userId: "user_1", pwd: await passwordFingerprint(user.passwordHash) });
  });

  it("refuses a token made with another secret", async () => {
    const token = await createAppToken(user);
    vi.stubEnv("NEXTAUTH_SECRET", "another-secret-entirely-9876543210");
    expect(await readAppToken(token)).toBeNull();
  });

  it("refuses a website session token (other salt), even with the right claims", async () => {
    const session = await encode({ token: { sub: "user_1", aud: "app", pwd: "x" }, secret: process.env.NEXTAUTH_SECRET! });
    expect(await readAppToken(session)).toBeNull();
  });

  it("refuses an expired token", async () => {
    vi.useFakeTimers({ now: new Date("2026-01-01T00:00:00Z") });
    const token = await createAppToken(user);
    vi.setSystemTime(new Date(Date.parse("2026-01-01T00:00:00Z") + (APP_TOKEN_MAX_AGE + 60) * 1000));
    expect(await readAppToken(token)).toBeNull();
  });

  it("refuses garbage", async () => {
    expect(await readAppToken("not-a-token")).toBeNull();
    expect(await readAppToken("")).toBeNull();
  });

  it("changes the fingerprint when the password changes", async () => {
    expect(await passwordFingerprint("$2a$10$one")).not.toBe(await passwordFingerprint("$2a$10$two"));
    expect(await passwordFingerprint("$2a$10$one")).toMatch(/^[0-9a-f]{24}$/);
  });
});
