export {};

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = document.querySelectorAll<HTMLElement>("[data-reveal]");
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 },
  );
  revealElements.forEach((el) => {
    el.classList.add("reveal-ready");
    observer.observe(el);
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      observer.disconnect();
      revealElements.forEach((el) => el.classList.remove("reveal-ready"));
    }
  });
}

document.querySelectorAll<HTMLElement>(".contact-link").forEach((link) => {
  const chars = [
    ...link.querySelectorAll<HTMLElement>(".contact-base .weight-char"),
  ];
  const paintedChars = [
    ...link.querySelectorAll<HTMLElement>(".contact-ink .weight-char"),
  ];
  const setCircleOrigin = (event: PointerEvent) => {
    const box = link.getBoundingClientRect();
    const x = Math.max(0, Math.min(box.width, event.clientX - box.left));
    const y = Math.max(0, Math.min(box.height, event.clientY - box.top));
    link.style.setProperty("--cx", `${x}px`);
    link.style.setProperty("--cy", `${y}px`);
  };
  link.addEventListener("pointerenter", setCircleOrigin);
  let frame = 0;
  let pointerX = 0;
  const resetWeight = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    [...chars, ...paintedChars].forEach((char) =>
      char.style.removeProperty("--w"),
    );
  };
  link.addEventListener("pointermove", (event) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    pointerX = event.clientX;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (reducedMotion.matches) return;
      // Finish all layout reads before writing variable-font weights.
      const centers = chars.map((char) => {
        const box = char.getBoundingClientRect();
        return box.left + box.width / 2;
      });
      chars.forEach((char, index) => {
        const distance = Math.abs(pointerX - centers[index]);
        const weight = String(450 + 400 * Math.max(0, 1 - distance / 140));
        char.style.setProperty("--w", weight);
        paintedChars[index]?.style.setProperty("--w", weight);
      });
    });
  });
  link.addEventListener("pointerleave", (event) => {
    setCircleOrigin(event);
    resetWeight();
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) resetWeight();
  });
  link.addEventListener("focus", () => {
    if (!link.matches(":focus-visible")) return;
    link.style.setProperty("--cx", "50%");
    link.style.setProperty("--cy", "50%");
  });
});
