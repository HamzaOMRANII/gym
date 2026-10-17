/* <muscle-map group="chest" view="front">: flat anatomical silhouette with the target muscles highlighted. */
const NS = "http://www.w3.org/2000/svg";

const FRONT = `
  <ellipse cx="100" cy="36" rx="18.5" ry="22"/>
  <path d="M91 56h18v12l-9 6-9-6z"/>
  <path data-g="traps" d="M69 84c8-10 18-15 31-16 13 1 23 6 31 16-10-3-20-5-31-5s-21 2-31 5z"/>
  <path data-g="shoulders" d="M68 86c-9 2-15 9-16 19-1 9 1 16 4 21l13-6c-2-11-1-22 -1-34z"/>
  <path data-g="shoulders" d="M132 86c9 2 15 9 16 19 1 9-1 16-4 21l-13-6c2-11 1-22 1-34z"/>
  <path data-g="chest" d="M97 88v34c-9 2-18 1-24-4-5-4-7-12-6-20 8-6 19-9 30-10z"/>
  <path data-g="chest" d="M103 88v34c9 2 18 1 24-4 5-4 7-12 6-20-8-6-19-9-30-10z"/>
  <path data-g="abs" d="M84 126h32v56c0 8-6 14-16 14s-16-6-16-14z"/>
  <path data-g="obliques" d="M78 124l5 2v52c-4-4-6-11-6-20z"/>
  <path data-g="obliques" d="M122 124l-5 2v52c4-4 6-11 6-20z"/>
  <path data-g="biceps" d="M52 108c-5 12-7 25-7 38l14 3c1-13 3-26 7-37z"/>
  <path data-g="biceps" d="M148 108c5 12 7 25 7 38l-14 3c-1-13-3-26-7-37z"/>
  <path data-g="forearms" d="M45 150c-3 14-4 28-3 42l12 1c0-14 2-28 5-40z"/>
  <path data-g="forearms" d="M155 150c3 14 4 28 3 42l-12 1c0-14-2-28-5-40z"/>
  <path d="M42 194c-2 8-2 16 0 22 3 3 8 3 11 0 2-7 2-15 1-22z"/>
  <path d="M158 194c2 8 2 16 0 22-3 3-8 3-11 0-2-7-2-15-1-22z"/>
  <path data-g="glutes" d="M82 196h36c3 10 3 20 1 28H81c-2-8-2-18 1-28z"/>
  <path data-g="quads" d="M82 226h16v72c0 6-3 10-8 10s-9-4-9-10z"/>
  <path data-g="quads" d="M118 226h-16v72c0 6 3 10 8 10s9-4 9-10z"/>
  <path data-g="calves" d="M84 312h13v46c0 5-3 8-7 8s-7-3-7-8z"/>
  <path data-g="calves" d="M116 312h-13v46c0 5 3 8 7 8s7-3 7-8z"/>
  <path d="M82 368h16v10H82z"/>
  <path d="M118 368h-16v10h16z"/>
`;

const BACK = `
  <ellipse cx="100" cy="36" rx="18.5" ry="22"/>
  <path d="M91 56h18v12l-9 6-9-6z"/>
  <path data-g="traps" d="M70 82c8-8 18-13 30-14 12 1 22 6 30 14 4 12 2 24-4 34l-26 8-26-8c-6-10-8-22-4-34z"/>
  <path data-g="shoulders" d="M68 86c-9 2-15 9-16 19-1 9 1 16 4 21l13-6c-2-11-1-22 -1-34z"/>
  <path data-g="shoulders" d="M132 86c9 2 15 9 16 19 1 9-1 16-4 21l-13-6c2-11 1-22 1-34z"/>
  <path data-g="back" d="M100 122l26-8c4 16 2 34-6 48-6 6-13 9-20 9s-14-3-20-9c-8-14-10-32-6-48z"/>
  <path data-g="back" d="M84 174h32v18c0 7-7 12-16 12s-16-5-16-12z"/>
  <path data-g="triceps" d="M52 108c-5 12-7 25-7 38l14 3c1-13 3-26 7-37z"/>
  <path data-g="triceps" d="M148 108c5 12 7 25 7 38l-14 3c-1-13-3-26-7-37z"/>
  <path data-g="forearms" d="M45 150c-3 14-4 28-3 42l12 1c0-14 2-28 5-40z"/>
  <path data-g="forearms" d="M155 150c3 14 4 28 3 42l-12 1c0-14-2-28-5-40z"/>
  <path d="M42 194c-2 8-2 16 0 22 3 3 8 3 11 0 2-7 2-15 1-22z"/>
  <path d="M158 194c2 8 2 16 0 22-3 3-8 3-11 0-2-7-2-15-1-22z"/>
  <path data-g="glutes" d="M100 200c11 0 19 6 19 16s-8 16-19 16-19-6-19-16 8-16 19-16z"/>
  <path data-g="hams" d="M82 234h16v66c0 6-3 10-8 10s-9-4-9-10z"/>
  <path data-g="hams" d="M118 234h-16v66c0 6 3 10 8 10s9-4 9-10z"/>
  <path data-g="calves" d="M83 312h14c2 16 2 32 0 46-2 5-10 5-12 0-2-14-4-30-2-46z"/>
  <path data-g="calves" d="M117 312h-14c-2 16-2 32 0 46 2 5 10 5 12 0 2-14 4-30 2-46z"/>
  <path d="M82 368h16v10H82z"/>
  <path d="M118 368h-16v10h16z"/>
`;

// Which parts light up for a target, and which view reads best.
const TARGETS = {
  chest: { view: "front", hot: ["chest"], warm: ["shoulders", "triceps"] },
  back: { view: "back", hot: ["back"], warm: ["biceps", "traps"] },
  shoulders: { view: "front", hot: ["shoulders"], warm: ["traps", "triceps"] },
  arms: { view: "front", hot: ["biceps", "triceps"], warm: ["forearms"] },
  biceps: { view: "front", hot: ["biceps"], warm: ["forearms"] },
  triceps: { view: "back", hot: ["triceps"], warm: ["shoulders"] },
  legs: { view: "front", hot: ["quads", "hams"], warm: ["glutes", "calves"] },
  quads: { view: "front", hot: ["quads"], warm: ["glutes"] },
  hams: { view: "back", hot: ["hams"], warm: ["glutes"] },
  glutes: { view: "back", hot: ["glutes"], warm: ["hams"] },
  calves: { view: "back", hot: ["calves"], warm: [] },
  core: { view: "front", hot: ["abs", "obliques"], warm: [] },
  abs: { view: "front", hot: ["abs"], warm: ["obliques"] },
  fullbody: { view: "front", hot: [], warm: ["chest", "quads", "shoulders", "abs"] },
};

export const BACK_VIEW = new Set(["back", "triceps", "hams", "glutes", "calves"]);

class MuscleMap extends HTMLElement {
  static get observedAttributes() { return ["group", "view"]; }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }

  render() {
    const target = TARGETS[(this.getAttribute("group") || "fullbody").toLowerCase()] || TARGETS.fullbody;
    const view = (this.getAttribute("view") || target.view) === "back" ? "back" : "front";
    const hot = new Set(target.hot);
    const warm = new Set(target.warm);
    const uid = `mm${Math.random().toString(36).slice(2, 8)}`;

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 200 392");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<defs><filter id="${uid}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g>${view === "back" ? BACK : FRONT}</g>`;
    svg.querySelectorAll("ellipse, path").forEach((part) => {
      const group = part.getAttribute("data-g");
      if (group && hot.has(group)) {
        part.setAttribute("fill", "#EA580C");
        part.setAttribute("filter", `url(#${uid})`);
      } else if (group && warm.has(group)) {
        part.setAttribute("fill", "#EA580C");
        part.setAttribute("opacity", "0.32");
      } else {
        part.setAttribute("fill", "#3a3430");
      }
      part.setAttribute("stroke", "rgba(255,255,255,0.08)");
      part.setAttribute("stroke-width", "1");
    });

    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = "<style>:host{display:block;width:100%}svg{display:block;width:100%;height:100%}</style>";
    this.shadowRoot.append(svg);
  }
}

if (!customElements.get("muscle-map")) customElements.define("muscle-map", MuscleMap);

// Exercise -> muscle-map target key.
export function targetFor(exercise) {
  if (!exercise) return "fullbody";
  const muscles = (exercise.muscles || "").toLowerCase();
  if (muscles.startsWith("triceps")) return "triceps";
  if (muscles.startsWith("biceps")) return "biceps";
  if (muscles.startsWith("calves")) return "calves";
  if (muscles.startsWith("hamstring")) return "hams";
  if (muscles.startsWith("quad")) return "quads";
  if (muscles.startsWith("glute")) return "glutes";
  if (muscles.startsWith("oblique")) return "core";
  if (muscles.startsWith("upper chest") || muscles.startsWith("chest")) return "chest";
  if (muscles.startsWith("back") || muscles.startsWith("upper back")) return "back";
  const shoulder = muscles.indexOf("shoulder");
  if (shoulder >= 0 && shoulder < 6) return "shoulders";
  if (muscles.startsWith("core")) return "core";
  return exercise.category === "arms" ? "arms" : (exercise.category || "fullbody");
}
