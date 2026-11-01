import { describe, expect, it } from "vitest";
import { MODELS, getModel } from "@/data/worksheets/origami";
import { area, diamond, fold, outline, pt, turnOver } from "@/lib/sheets/origami";
import { origamiStates } from "@/scripts/sheets/origami-layout";

const round = (n: number) => Math.round(n * 1000) / 1000 || 0;
const corners = (pts: { x: number; y: number }[]) => pts.map((p) => [round(p.x), round(p.y)]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
const paperArea = (p: ReturnType<typeof diamond>) => p.reduce((s, q) => s + area(q.pts), 0);

describe("folding", () => {
  it("keeps the paper's area and turns the folded part over", () => {
    const folded = fold(diamond(), { line: [pt(-1, 0), pt(1, 0)], from: pt(0, -1) });
    expect(paperArea(folded)).toBeCloseTo(2);
    expect(folded.map((p) => p.face)).toEqual(["white", "colour"]);
    expect(corners(outline(folded))).toEqual([[-1, 0], [0, 1], [1, 0]]);
  });

  it("puts a part folded behind under the rest", () => {
    const folded = fold(diamond(), { line: [pt(-1, 0), pt(1, 0)], from: pt(0, -1), behind: true });
    expect(folded.map((p) => p.face)).toEqual(["colour", "white"]);
  });

  it("turning over shows the other side, in reverse order", () => {
    const folded = fold(diamond(), { line: [pt(-1, 0), pt(1, 0)], from: pt(0, -1) });
    expect(turnOver(folded).map((p) => p.face)).toEqual(["white", "colour"]);
  });
});

describe("origami models", () => {
  it.each(MODELS.map((m) => m.id))("%s: 6 to 9 steps, every fold moves paper, nothing lost", (id) => {
    const m = getModel(id);
    expect(m.steps.length + 1).toBeGreaterThanOrEqual(6);
    expect(m.steps.length + 1).toBeLessThanOrEqual(9);
    const states = origamiStates(m);
    for (const s of states) expect(paperArea(s.before)).toBeCloseTo(2);
    expect(paperArea(states.done!)).toBeCloseTo(2);
  });

  it("the cup's side flaps reach the opposite edge, level with each other", () => {
    const done = origamiStates(getModel("cup")).done!;
    const o = corners(outline(done));
    expect(o).toEqual([[-0.414, 0.586], [-0.172, 0], [0.172, 0], [0.414, 0.586]]);
  });

  it("the dog's ears hang outside its face", () => {
    const done = origamiStates(getModel("dog")).done!;
    const xs = outline(done).map((p) => p.x);
    expect(Math.min(...xs)).toBeCloseTo(-0.75);
    expect(corners(outline(done))).toContainEqual([-0.595, -0.568]);
  });
});
