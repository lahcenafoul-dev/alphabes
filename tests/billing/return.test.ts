import { beforeEach, describe, expect, it, vi } from "vitest";

const sync = vi.fn();
// A failure is thrown by this wrapper, not by the spy: with vitest 2.0.5 a
// spy that rejects leaves an unhandled rejection behind (its own result
// tracking), which fails later tests even though the code catches it.
let failWith: Error | null = null;
vi.mock("@/lib/billing/sync", () => ({
  syncSubscription: async (...a: unknown[]) => {
    if (failWith) throw failWith;
    return sync(...a);
  },
}));

const { confirmReturn, requestedNotice } = await import("@/lib/billing/return");
const prisma = {} as never;

beforeEach(() => {
  sync.mockReset();
  failWith = null;
});

describe("confirmReturn (back from PayPal)", () => {
  it("never calls PayPal with a malformed id", async () => {
    for (const id of [undefined, "", "../x", ["I-ABC1234567"], "I-abc"]) {
      expect(await confirmReturn(prisma, "u1", id)).toBe("returnProblem");
    }
    expect(sync).not.toHaveBeenCalled();
  });

  it("checks the subscription belongs to this parent", async () => {
    sync.mockResolvedValue({ result: "updated", userId: "u1", status: "ACTIVE", pro: true });
    expect(await confirmReturn(prisma, "u1", "I-ABC1234567")).toBe("returnActive");
    expect(sync).toHaveBeenCalledWith(prisma, "I-ABC1234567", { expectUserId: "u1" });
  });

  it("maps every outcome to a notice", async () => {
    const cases: [unknown, string][] = [
      [{ result: "updated", status: "SUSPENDED", pro: false }, "returnProblem"],
      [{ result: "ignored", reason: "not_paid" }, "returnPending"],
      [{ result: "ignored", reason: "other_account" }, "returnProblem"],
      [{ result: "ignored", reason: "unknown_plan" }, "returnProblem"],
      [{ result: "duplicate", userId: "u1" }, "duplicate"],
    ];
    for (const [result, notice] of cases) {
      sync.mockResolvedValueOnce(result);
      expect(await confirmReturn(prisma, "u1", "I-ABC1234567"), JSON.stringify(result)).toBe(notice);
    }
  });

  it("shows a problem notice, not an error page, when PayPal fails", async () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    failWith = new Error("PayPal down");
    expect(await confirmReturn(prisma, "u1", "I-ABC1234567")).toBe("returnProblem");
    expect(quiet).toHaveBeenCalledWith("PayPal: return check failed:", "PayPal down");
    quiet.mockRestore();
  });
});

describe("requestedNotice", () => {
  it("reads only the known values", () => {
    expect(requestedNotice("return")).toBe("return");
    expect(requestedNotice("already_pro")).toBe("alreadyPro");
    expect(requestedNotice("other")).toBeNull();
    expect(requestedNotice(["return"])).toBeNull();
    expect(requestedNotice(undefined)).toBeNull();
  });
});
