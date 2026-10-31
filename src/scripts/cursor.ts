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
let paintVersion = 0;
let selectionDirty = true;
let selectionRects: DOMRect[] = [];
const sourceObserver = new MutationObserver(() => {
  paintDirty = true;
  selectionDirty = true;
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
      "script,style,link,iframe,object,embed,img,audio,video,source,.contact-ink",
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
  selectionInk.replaceChildren(clone.cloneNode(true));
  paintVersion++;
}
const ink = document.createElement("div");
ink.className = "cursor-ink";
ink.inert = true;
const selectionMask = document.createElement("div");
selectionMask.className = "cursor-selection";
const selectionInk = document.createElement("div");
selectionInk.className = "cursor-selection-ink";
selectionInk.inert = true;
selectionMask.append(selectionInk);
cursor?.append(ink, selectionMask);
const fillLayers = new Map<
  HTMLElement,
  { mask: HTMLDivElement; ink: HTMLDivElement; version: number }
>();
const logoLayers = new Map<SVGSVGElement, SVGSVGElement>();
const decorationLayers = new Map<HTMLElement, HTMLDivElement>();
if (cursor) cursor.inert = true;

function updateContrast() {
  if (!cursor) return false;
  if (selectionDirty) {
    selectionRects = [];
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      for (let i = 0; i < selection.rangeCount; i++) {
        selectionRects.push(...selection.getRangeAt(i).getClientRects());
      }
    }
    selectionDirty = false;
  }
  const overlaps = (r: DOMRect) =>
    r.width > 0 &&
    r.height > 0 &&
    r.right > x &&
    r.left < x + width &&
    r.bottom > y &&
    r.top < y + height;
  const path = selectionRects
    .filter(overlaps)
    .map((r) => {
      const left = r.left - x,
        top = r.top - y;
      return `M${left} ${top}h${r.width}v${r.height}h${-r.width}Z`;
    })
    .join(" ");
  selectionMask.style.clipPath = path ? `path("${path}")` : "inset(100%)";
  selectionMask.style.opacity = path ? "1" : "0";
  const source = paintTarget?.getBoundingClientRect();
  if (source) {
    selectionInk.style.left = `${source.left - x}px`;
    selectionInk.style.top = `${source.top - y}px`;
    selectionInk.style.width = `${source.width}px`;
    const copy = selectionInk.firstElementChild as HTMLElement | null;
    if (copy) copy.style.width = `${source.width}px`;
  }
  let animating = false;
  const liveFills = new Set(
    document.querySelectorAll<HTMLElement>(
      ".contact-links > .contact-link > .contact-ink, .page-shell .theme-toggle, body > .skip-link",
    ),
  );
  for (const [fill, layer] of fillLayers) {
    if (!liveFills.has(fill)) {
      layer.mask.remove();
      fillLayers.delete(fill);
    } else layer.mask.style.display = "none";
  }
  for (const fill of liveFills) {
    const box = fill.getBoundingClientRect();
    if (!overlaps(box)) continue;
    const styles = getComputedStyle(fill);
    if (
      styles.display === "none" ||
      styles.backgroundColor !== getComputedStyle(cursor).backgroundColor
    )
      continue;
    let layer = fillLayers.get(fill);
    if (!layer) {
      const mask = document.createElement("div");
      mask.className = "cursor-fill";
      const paint = document.createElement("div");
      paint.className = "cursor-fill-ink";
      paint.inert = true;
      mask.append(paint);
      cursor.append(mask);
      layer = { mask, ink: paint, version: -1 };
      fillLayers.set(fill, layer);
    }
    Object.assign(layer.mask.style, {
      display: "block",
      left: `${box.left - x}px`,
      top: `${box.top - y}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
      clipPath: styles.clipPath,
      borderRadius: styles.borderRadius,
    });
    if (layer.version !== paintVersion) {
      layer.ink.replaceChildren();
      if (ink.firstElementChild)
        layer.ink.append(ink.firstElementChild.cloneNode(true));
      layer.version = paintVersion;
    }
    if (source) {
      Object.assign(layer.ink.style, {
        left: `${source.left - box.left}px`,
        top: `${source.top - box.top}px`,
        width: `${source.width}px`,
      });
      const copy = layer.ink.firstElementChild as HTMLElement | null;
      if (copy) copy.style.width = `${source.width}px`;
    }
    animating ||= fill
      .getAnimations()
      .some((animation) => animation.playState === "running");
  }
  const liveLogos = new Set(
    document.querySelectorAll<SVGSVGElement>(
      ".systems .system-heading > .system-logo",
    ),
  );
  for (const [logo, layer] of logoLayers) {
    if (!liveLogos.has(logo)) {
      layer.remove();
      logoLayers.delete(logo);
    } else layer.style.display = "none";
  }
  for (const logo of liveLogos) {
    const box = logo.getBoundingClientRect();
    if (!overlaps(box)) continue;
    let layer = logoLayers.get(logo);
    if (!layer) {
      layer = logo.cloneNode(true) as SVGSVGElement;
      layer.setAttribute("class", "cursor-logo");
      cursor.append(layer);
      logoLayers.set(logo, layer);
    }
    // The cursor clips the SVG itself, preserving transparent holes and edges.
    Object.assign(layer.style, {
      display: "block",
      left: `${box.left - x}px`,
      top: `${box.top - y}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    });
  }
  const decorated = new Set(
    document.querySelectorAll<HTMLElement>(".header nav a, .back-to-top"),
  );
  for (const [element, layer] of decorationLayers) {
    if (!decorated.has(element)) {
      layer.remove();
      decorationLayers.delete(element);
    } else layer.style.display = "none";
  }
  for (const element of decorated) {
    const box = element.getBoundingClientRect();
    if (!overlaps(box)) continue;
    const styles = getComputedStyle(element, "::after");
    if (
      styles.content === "none" ||
      styles.backgroundColor !== getComputedStyle(cursor).backgroundColor
    )
      continue;
    const lineWidth = parseFloat(styles.width),
      lineHeight = parseFloat(styles.height);
    if (!Number.isFinite(lineWidth) || !Number.isFinite(lineHeight)) continue;
    let layer = decorationLayers.get(element);
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "cursor-decoration";
      cursor.append(layer);
      decorationLayers.set(element, layer);
    }
    const top =
      styles.top === "auto"
        ? box.height - (parseFloat(styles.bottom) || 0) - lineHeight
        : parseFloat(styles.top);
    Object.assign(layer.style, {
      display: "block",
      left: `${box.left - x + (parseFloat(styles.left) || 0)}px`,
      top: `${box.top - y + top}px`,
      width: `${lineWidth}px`,
      height: `${lineHeight}px`,
      transform: styles.transform,
      transformOrigin: styles.transformOrigin,
    });
    animating ||= element
      .getAnimations({ subtree: true })
      .some((animation) => animation.playState === "running");
  }
  return animating;
}
const enabled = () =>
  finePointer.matches && !reducedMotion.matches && !forcedColors.matches;
function hide() {
  shown = false;
  sourceObserver.disconnect();
  removalObserver.disconnect();
  paintTarget = null;
  paintDirty = false;
  ink.replaceChildren();
  selectionInk.replaceChildren();
  selectionMask.style.opacity = "0";
  for (const layer of fillLayers.values()) layer.mask.remove();
  fillLayers.clear();
  for (const layer of logoLayers.values()) layer.remove();
  logoLayers.clear();
  for (const layer of decorationLayers.values()) layer.remove();
  decorationLayers.clear();
  selectionDirty = true;
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
  const animatingFill = updateContrast();
  frame =
    animatingFill || Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1
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
    const next =
      target.closest<HTMLElement>("a,button,p,h1,h2,h3,dt,dd") ??
      target.closest<HTMLElement>("span,small,summary,strong");
    if (next !== paintTarget) {
      paintTarget = next;
      sourceObserver.disconnect();
      ink.replaceChildren();
      selectionInk.replaceChildren();
      paintVersion++;
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
const refreshSelection = () => {
  selectionDirty = true;
  if (shown && !frame) frame = requestAnimationFrame(draw);
};
document.addEventListener("selectionchange", refreshSelection);
document.fonts?.addEventListener("loadingdone", refreshSelection);
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
