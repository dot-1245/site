export {};

const cursor = document.querySelector<HTMLElement>(".cursor");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const forcedColors = matchMedia("(forced-colors: active)");
let frame = 0;
let x = 0,
  y = 0,
  targetX = 0,
  targetY = 0;
let width = 12,
  height = 12;
let shown = false;
let paintTarget: HTMLElement | null = null;
let paintDirty = false;
const sourceObserver = new MutationObserver(() => {
  paintDirty = true;
  if (shown && !frame) frame = requestAnimationFrame(draw);
});

const removalObserver = new MutationObserver(() => {
  if (paintTarget && !paintTarget.isConnected) hide();
});
function refreshPaint() {
  ink.replaceChildren();
  paintDirty = false;
  if (!paintTarget) return;
  const clone = paintTarget.cloneNode(true) as HTMLElement;
  const originals = [paintTarget, ...paintTarget.querySelectorAll("*")];
  const copies = [clone, ...clone.querySelectorAll("*")];
  clone
    .querySelectorAll(
      "script,style,link,iframe,object,embed,img,audio,video,source",
    )
    .forEach((node) => node.remove());
  // The site's paint targets contain text and inline SVG only. Never retain
  // active attributes, IDs, or delegated-behavior hooks in the inert overlay.
  for (const node of copies) {
    for (const attribute of [...node.attributes]) {
      if (
        /^(?:on|data-|aria-)/i.test(attribute.name) ||
        /^(?:id|name|href|src|srcset|autofocus|form|formaction|tabindex)$/i.test(
          attribute.name,
        )
      )
        node.removeAttribute(attribute.name);
    }
    if (node instanceof HTMLElement) node.tabIndex = -1;
    if (node instanceof HTMLButtonElement) node.type = "button";
  }
  // Copy inherited typography and live transforms before attaching the clone;
  // this keeps footer logos, variable glyphs and arrow shifts aligned.
  copies.forEach((copy, index) => {
    if (copy !== clone && !clone.contains(copy)) return;
    const original = originals[index];
    if (
      !original ||
      !(copy instanceof HTMLElement || copy instanceof SVGElement)
    )
      return;
    const styles = getComputedStyle(original);
    [
      "font-family",
      "font-size",
      "font-weight",
      "font-variation-settings",
      "line-height",
      "letter-spacing",
      "text-align",
      "transform",
      "display",
      "box-sizing",
      "padding",
      "border-width",
      "border-style",
      "gap",
      "align-items",
      "justify-content",
    ].forEach((property) =>
      copy.style.setProperty(property, styles.getPropertyValue(property)),
    );
  });
  ink.append(clone);
}
const ink = document.createElement("div");
ink.className = "cursor-ink";
ink.inert = true;
cursor?.append(ink);
const enabled = () =>
  finePointer.matches && !reducedMotion.matches && !forcedColors.matches;
function hide() {
  shown = false;
  sourceObserver.disconnect();
  removalObserver.disconnect();
  paintTarget = null;
  paintDirty = false;
  ink.replaceChildren();
  cancelAnimationFrame(frame);
  frame = 0;
  if (cursor) cursor.style.opacity = "0";
  document.documentElement.classList.remove("cursor-active");
}
function draw() {
  if (!cursor || !shown) return;
  if (paintTarget && !paintTarget.isConnected) {
    hide();
    return;
  }
  if (paintDirty) refreshPaint();
  x += (targetX - x) * 0.3;
  y += (targetY - y) * 0.3;
  cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
  cursor.style.width = `${width}px`;
  cursor.style.height = `${height}px`;
  if (paintTarget) {
    const box = paintTarget.getBoundingClientRect();
    ink.style.left = `${box.left - x}px`;
    ink.style.top = `${box.top - y}px`;
    ink.style.width = `${box.width}px`;
    const clone = ink.firstElementChild as HTMLElement | null;
    if (clone) clone.style.width = `${box.width}px`;
  }
  frame =
    Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1
      ? requestAnimationFrame(draw)
      : 0;
}
addEventListener(
  "pointermove",
  (event) => {
    if (!cursor || !enabled() || event.pointerType !== "mouse") {
      hide();
      return;
    }
    const target = event.target;
    if (!(target instanceof Element)) return;
    const next = target.closest<HTMLElement>("a,button,p,h1,h2,h3,dt,dd");
    if (next !== paintTarget) {
      paintTarget = next;
      sourceObserver.disconnect();
      ink.replaceChildren();
      paintDirty = true;
      if (next) {
        sourceObserver.observe(next, {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true,
        });
        removalObserver.observe(document.body, {
          subtree: true,
          childList: true,
        });
      } else removalObserver.disconnect();
    }
    const morph = target.closest<HTMLElement>("[data-morph]");
    const text = target.closest("p,h1,h2,h3,dt,dd");
    if (morph) {
      const box = morph.getBoundingClientRect();
      width = box.width + 12;
      height = box.height + 12;
      targetX = box.left - 6;
      targetY = box.top - 6;
      cursor.style.borderRadius = "6px";
    } else {
      width = text ? 3 : 12;
      height = text ? 24 : 12;
      targetX = event.clientX - width / 2;
      targetY = event.clientY - height / 2;
      cursor.style.borderRadius = text ? "2px" : "50%";
    }
    if (!shown) {
      x = targetX;
      y = targetY;
      shown = true;
    }
    cursor.style.opacity = "1";
    document.documentElement.classList.add("cursor-active");
    if (!frame) frame = requestAnimationFrame(draw);
  },
  { passive: true },
);
document.documentElement.addEventListener("pointerleave", hide);
addEventListener("blur", hide);
addEventListener("scroll", hide, { passive: true });
addEventListener("resize", hide, { passive: true });
addEventListener("keydown", (event) => {
  if (event.key === "Tab") hide();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) hide();
});
[finePointer, reducedMotion, forcedColors].forEach((query) =>
  query.addEventListener("change", hide),
);
