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
  const chars = [...link.querySelectorAll<HTMLElement>(".weight-char")];
  link.addEventListener("pointerenter", (event) => {
    const box = link.getBoundingClientRect();
    link.style.setProperty("--cx", `${event.clientX - box.left}px`);
    link.style.setProperty("--cy", `${event.clientY - box.top}px`);
  });
  let frame = 0;
  let pointerX = 0;
  const resetWeight = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    chars.forEach((char) => char.style.removeProperty("--w"));
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
        char.style.setProperty(
          "--w",
          String(450 + 400 * Math.max(0, 1 - distance / 140)),
        );
      });
    });
  });
  link.addEventListener("pointerleave", resetWeight);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) resetWeight();
  });
  link.addEventListener("focus", () => {
    link.style.setProperty("--cx", "50%");
    link.style.setProperty("--cy", "50%");
  });
});
