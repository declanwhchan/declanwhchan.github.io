import { useEffect, useRef, useState } from "react";
import { Check, FileText, Github, Linkedin, Mail, Moon, Sun } from "lucide-react";
import cvUrl from "./assets/ChanDeclanCV.pdf";
import logoUrl from "./assets/logo.png";

const email = "declan.chan@mail.utoronto.ca";

const formatTorontoTime = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

const primaryLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/declanwhchan/",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/declanwhchan",
    icon: Github,
  },
  {
    label: "CV",
    href: cvUrl,
    icon: FileText,
  },
];

function App() {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("declan-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "dark";
  });
  const canvasRef = useRef(null);

  usePointerDrift();
  useAtmosphere(canvasRef);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("declan-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#050712" : "#eef5fb");
  }, [theme]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <main className="identity-stage" aria-label="Declan Chan personal connect page">
      <button
        className="theme-toggle"
        type="button"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
      >
        {theme === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
      </button>

      <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />

      <section className="hub" aria-labelledby="hub-title">
        <div className="profile-mark" aria-hidden="true">
          <img src={logoUrl} width="72" height="72" alt="" decoding="async" />
        </div>

        <div className="name-line">
          <span className="status-dot" aria-hidden="true" />
          <h1 id="hub-title">Declan Chan</h1>
        </div>
        <p className="affiliation-line">Engineering Science @ University of Toronto</p>

        <nav className="link-stack" aria-label="Primary links">
          {primaryLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                className="hub-link"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                key={link.label}
                style={{ "--delay": `${index * 70}ms` }}
              >
                <span>{link.label}</span>
                <Icon size={18} aria-hidden="true" />
              </a>
            );
          })}

          <button className="hub-link" type="button" onClick={copyEmail} style={{ "--delay": "280ms" }}>
            <span>Email</span>
            {copied ? <Check size={18} aria-hidden="true" /> : <Mail size={18} aria-hidden="true" />}
          </button>
        </nav>
      </section>

      <TorontoClock />
    </main>
  );
}

function TorontoClock() {
  const [torontoTime, setTorontoTime] = useState(formatTorontoTime);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTorontoTime(formatTorontoTime());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="time-widget" aria-label={`Toronto time ${torontoTime}`}>
      <span>Toronto</span>
      <time dateTime={torontoTime}>{torontoTime}</time>
    </div>
  );
}

function usePointerDrift() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return undefined;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let smoothDriftX = 0;
    let smoothDriftY = 0;
    let targetDriftX = 0;
    let targetDriftY = 0;
    let animationFrame = 0;

    function move(event) {
      pointerX = event.clientX;
      pointerY = event.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetDriftX = (pointerX - centerX) / centerX;
      targetDriftY = (pointerY - centerY) / centerY;
    }

    function render() {
      smoothDriftX += (targetDriftX - smoothDriftX) * 0.075;
      smoothDriftY += (targetDriftY - smoothDriftY) * 0.075;

      document.documentElement.style.setProperty("--drift-x", smoothDriftX.toFixed(4));
      document.documentElement.style.setProperty("--drift-y", smoothDriftY.toFixed(4));
      document.documentElement.style.setProperty("--near-x", (smoothDriftX * 1.2).toFixed(4));
      document.documentElement.style.setProperty("--near-y", (smoothDriftY * 1.2).toFixed(4));
      document.documentElement.style.setProperty("--mid-x", (smoothDriftX * 0.62).toFixed(4));
      document.documentElement.style.setProperty("--mid-y", (smoothDriftY * 0.62).toFixed(4));
      document.documentElement.style.setProperty("--far-x", (smoothDriftX * 0.22).toFixed(4));
      document.documentElement.style.setProperty("--far-y", (smoothDriftY * 0.22).toFixed(4));

      animationFrame = window.requestAnimationFrame(render);
    }

    window.addEventListener("mousemove", move);
    render();

    return () => {
      window.removeEventListener("mousemove", move);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);
}

function useAtmosphere(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let dust = [];
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let resizeFrame = 0;
    let currentTheme = "";
    let lastFrame = performance.now();
    const backdrop = document.createElement("canvas");
    const backdropContext = backdrop.getContext("2d", { alpha: true });
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      speed: 0,
      active: false,
    };

    function createDust(index) {
      const depth = 0.18 + Math.random() * 0.82;
      const x = Math.random() * width;
      const y = Math.random() * height;

      return {
        x,
        y,
        homeX: x,
        homeY: y,
        depth,
        radius: 0.38 + depth * 0.95 + (index % 37 === 0 ? 0.42 : 0),
        alpha: 0.1 + depth * 0.3,
        hue: index % 7 === 0 ? 184 : index % 5 === 0 ? 258 : 209 + Math.random() * 24,
        phase: Math.random() * Math.PI * 2,
        driftX: 1.6 + Math.random() * 5.2,
        driftY: 1.1 + Math.random() * 4.4,
        speed: 0.00018 + Math.random() * 0.00022,
      };
    }

    function renderBackdrop(isLight) {
      if (!backdropContext) return;

      backdrop.width = Math.floor(width * ratio);
      backdrop.height = Math.floor(height * ratio);
      backdropContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      backdropContext.clearRect(0, 0, width, height);

      const base = backdropContext.createLinearGradient(0, 0, width, height);
      if (isLight) {
        base.addColorStop(0, "#f8fcff");
        base.addColorStop(0.42, "#eaf3fb");
        base.addColorStop(0.72, "#dfeaf4");
        base.addColorStop(1, "#fafdff");
      } else {
        base.addColorStop(0, "#01030a");
        base.addColorStop(0.34, "#04081a");
        base.addColorStop(0.66, "#071122");
        base.addColorStop(1, "#02040b");
      }
      backdropContext.fillStyle = base;
      backdropContext.fillRect(0, 0, width, height);

      const nebulae = [
        [width * 0.2, height * 0.24, Math.max(width, height) * 0.62, isLight ? "rgba(55, 125, 166, 0.12)" : "rgba(37, 143, 189, 0.18)"],
        [width * 0.78, height * 0.68, Math.max(width, height) * 0.58, isLight ? "rgba(82, 89, 164, 0.1)" : "rgba(87, 65, 168, 0.14)"],
        [width * 0.52, height * 0.46, Math.max(width, height) * 0.42, isLight ? "rgba(32, 83, 126, 0.075)" : "rgba(20, 51, 98, 0.2)"],
      ];

      backdropContext.globalCompositeOperation = isLight ? "source-over" : "screen";
      nebulae.forEach(([x, y, radius, color]) => {
        const gradient = backdropContext.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.36, color.replace(/[\d.]+\)$/, isLight ? "0.045)" : "0.07)"));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        backdropContext.fillStyle = gradient;
        backdropContext.fillRect(0, 0, width, height);
      });

      backdropContext.globalCompositeOperation = "source-over";
      backdropContext.fillStyle = isLight ? "rgba(18, 50, 78, 0.18)" : "rgba(219, 241, 255, 0.62)";
      const starCount = width < 560 ? 74 : width < 920 ? 108 : 148;
      for (let index = 0; index < starCount; index += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const alpha = Math.random() * (isLight ? 0.18 : 0.42);
        const size = Math.random() < 0.08 ? 1.2 : 0.65;
        backdropContext.globalAlpha = alpha;
        backdropContext.fillRect(x, y, size, size);
      }

      backdropContext.globalAlpha = isLight ? 0.05 : 0.08;
      backdropContext.strokeStyle = isLight ? "rgba(18, 58, 92, 0.28)" : "rgba(154, 215, 246, 0.32)";
      backdropContext.lineWidth = 1;
      backdropContext.beginPath();
      const lensY = height * 0.56;
      backdropContext.moveTo(-30, lensY);
      for (let x = -30; x <= width + 30; x += 70) {
        backdropContext.lineTo(x, lensY + Math.sin(x * 0.012) * 14);
      }
      backdropContext.stroke();
      backdropContext.globalAlpha = 1;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.1 : 1.25);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      renderBackdrop(currentTheme === "light");

      const dustCount = reduceMotion ? 42 : width < 560 ? 64 : width < 920 ? 88 : 118;
      dust = Array.from({ length: dustCount }, (_, index) => createDust(index));
    }

    function movePointer(event) {
      const nextX = event.clientX;
      const nextY = event.clientY;

      pointer.speed += (Math.hypot(nextX - pointer.targetX, nextY - pointer.targetY) - pointer.speed) * 0.22;
      pointer.targetX = nextX;
      pointer.targetY = nextY;
      pointer.active = true;
    }

    function leavePointer() {
      pointer.active = false;
    }

    function scheduleResize() {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    }

    function handleMotionChange(event) {
      reduceMotion = event.matches;
      resize();
    }

    function handleVisibilityChange() {
      lastFrame = performance.now();
    }

    function drawGravitationalSheen(now, isLight) {
      const y = height * (0.58 + Math.sin(now * 0.00009) * 0.018);
      context.globalCompositeOperation = isLight ? "source-over" : "screen";
      context.globalAlpha = isLight ? 0.055 : 0.085;
      context.strokeStyle = isLight ? "rgba(25, 82, 118, 0.36)" : "rgba(151, 218, 246, 0.34)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-20, y);
      for (let x = -20; x <= width + 20; x += 78) {
        context.lineTo(x, y + Math.sin(x * 0.011 + now * 0.00022) * 10);
      }
      context.stroke();
      context.globalAlpha = 1;
    }

    function render(now) {
      if (document.hidden) {
        lastFrame = now;
        frame = window.requestAnimationFrame(render);
        return;
      }

      const nextTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      const isLight = nextTheme === "light";
      if (nextTheme !== currentTheme) {
        currentTheme = nextTheme;
        renderBackdrop(isLight);
      }

      const delta = Math.min(34, now - lastFrame || 16.67);
      const step = reduceMotion ? 0.18 : delta / 16.67;
      lastFrame = now;

      pointer.x += (pointer.targetX - pointer.x) * 0.12;
      pointer.y += (pointer.targetY - pointer.y) * 0.12;
      pointer.speed *= 0.9;

      context.clearRect(0, 0, width, height);
      context.drawImage(backdrop, 0, 0, width, height);
      if (!reduceMotion) drawGravitationalSheen(now, isLight);

      const fieldRadius = Math.min(260, Math.max(150, width * 0.18));
      const fieldRadiusSq = fieldRadius * fieldRadius;
      const parallaxX = pointer.active ? ((pointer.x - width / 2) / Math.max(width, 1)) * 12 : 0;
      const parallaxY = pointer.active ? ((pointer.y - height / 2) / Math.max(height, 1)) * 8 : 0;
      const pointerEnergy = Math.min(1.2, pointer.speed / 42);

      context.globalCompositeOperation = isLight ? "source-over" : "screen";

      dust.forEach((particle, index) => {
        const depth = particle.depth;
        const noiseX =
          Math.sin(now * particle.speed + particle.phase) * particle.driftX +
          parallaxX * (depth - 0.18);
        const noiseY =
          Math.cos(now * particle.speed * 0.82 + particle.phase) * particle.driftY +
          parallaxY * (depth - 0.18);
        let x = particle.homeX + noiseX;
        let y = particle.homeY + noiseY;

        if (pointer.active && !reduceMotion) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < fieldRadiusSq) {
            const distance = Math.max(Math.sqrt(distanceSq), 0.001);
            const influence = (1 - distance / fieldRadius) * (1 + pointerEnergy * 0.2);
            x -= (dx / distance) * influence * depth * 12;
            y -= (dy / distance) * influence * depth * 12;
          }
        }

        const twinkle = reduceMotion ? 0 : Math.sin(now * 0.0007 + particle.phase) * 0.035;
        const alpha = Math.max(0.035, particle.alpha + twinkle);
        const radius = particle.radius * (0.82 + depth * 0.34);

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = isLight
          ? `hsla(${particle.hue}, 42%, 28%, ${alpha * 0.64})`
          : `hsla(${particle.hue}, 88%, 86%, ${alpha})`;
        context.fill();

        if (index % 29 === 0) {
          context.beginPath();
          context.arc(x, y, radius * 2.8, 0, Math.PI * 2);
          context.fillStyle = isLight ? "rgba(43, 105, 139, 0.045)" : "rgba(151, 218, 246, 0.08)";
          context.fill();
        }
      });

      frame = window.requestAnimationFrame(render);
    }

    resize();
    render(lastFrame);
    window.addEventListener("resize", scheduleResize);
    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("pointerleave", leavePointer);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerleave", leavePointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener("change", handleMotionChange);
      window.cancelAnimationFrame(resizeFrame);
      window.cancelAnimationFrame(frame);
    };
  }, [canvasRef]);
}

export default App;
