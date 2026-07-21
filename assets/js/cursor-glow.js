(() => {
  const supportsEffect = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

  if (!supportsEffect) return;

  const style = document.createElement("style");

  style.textContent = `
    .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 22px;
      height: 22px;
      pointer-events: none;
      z-index: 9999;
      border: 1.5px solid var(--global-theme-color);
      border-radius: 50%;
      opacity: 0;
      transform: translate(-50%, -50%) scale(1);
      transition:
        opacity 160ms ease,
        transform 160ms ease,
        background-color 160ms ease;
      will-change: top, left, transform;
    }

    .cursor-ring.is-active {
      background-color: color-mix(
        in srgb,
        var(--global-theme-color) 12%,
        transparent
      );
      transform: translate(-50%, -50%) scale(1.55);
    }

    a,
    button,
    [role="button"] {
      transition:
        translate 160ms ease,
        color 160ms ease;
    }

    @media (pointer: coarse), (prefers-reduced-motion: reduce) {
      .cursor-ring {
        display: none;
      }
    }
  `;

  document.head.appendChild(style);

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);

  let currentX = -100;
  let currentY = -100;
  let targetX = -100;
  let targetY = -100;
  let magneticTarget = null;

  const interactiveSelector = "a, button, [role='button']";

  document.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    ring.style.opacity = "1";

    const nextTarget = event.target.closest(interactiveSelector);

    if (magneticTarget && magneticTarget !== nextTarget) {
      magneticTarget.style.translate = "";
    }

    magneticTarget = nextTarget;

    if (magneticTarget) {
      const bounds = magneticTarget.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const offsetX = (event.clientX - centerX) * 0.08;
      const offsetY = (event.clientY - centerY) * 0.08;

      magneticTarget.style.translate = `${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px`;

      ring.classList.add("is-active");
    } else {
      ring.classList.remove("is-active");
    }
  });

  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest(interactiveSelector);

    if (target && !target.contains(event.relatedTarget)) {
      target.style.translate = "";

      if (target === magneticTarget) {
        magneticTarget = null;
      }

      ring.classList.remove("is-active");
    }
  });

  document.documentElement.addEventListener("mouseleave", () => {
    ring.style.opacity = "0";

    if (magneticTarget) {
      magneticTarget.style.translate = "";
      magneticTarget = null;
    }
  });

  function animateRing() {
    currentX += (targetX - currentX) * 0.2;
    currentY += (targetY - currentY) * 0.2;

    ring.style.left = `${currentX}px`;
    ring.style.top = `${currentY}px`;

    requestAnimationFrame(animateRing);
  }

  animateRing();
})();
