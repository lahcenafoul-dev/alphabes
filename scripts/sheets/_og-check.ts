import { MODELS } from "../../data/worksheets/origami";
import { origamiStates } from "./origami-layout";
import { outline, type Paper } from "../../lib/sheets/origami";
const f = (n: number) => (Math.abs(n) < 5e-4 ? 0 : n).toFixed(3);
const show = (p: Paper) => p.map((q) => `${q.face[0]}[${q.pts.map((x) => f(x.x) + "," + f(x.y)).join(" ")}]`).join("\n    ");
for (const m of MODELS) {
  const st = origamiStates(m);
  console.log("==", m.id);
  st.forEach((s, i) => console.log(` step ${i + 1} before (${s.before.length} pieces):\n    ${show(s.before)}`));
  console.log(` done outline: ${outline(st.done!).map((x) => f(x.x) + "," + f(x.y)).join(" ")}\n    ${show(st.done!)}`);
}
