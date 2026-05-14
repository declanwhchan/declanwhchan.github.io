import { useEffect, useRef, useState } from "react";
import { Check, FileText, Github, Linkedin, Mail, Moon, Sun } from "lucide-react";

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
    href: "/assets/ChanDeclanCV.pdf",
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

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const stageRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorFrameRef = useRef(null);
  const canvasRef = useRef(null);

  useCursor(stageRef, cursorDotRef, cursorFrameRef);
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
    <main ref={stageRef} className="identity-stage" aria-label="Declan Chan personal connect page">
      <button
        className="theme-toggle"
        type="button"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
      >
        {theme === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
      </button>

      <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
      <div className="ambient-system" aria-hidden="true">
        <span className="coordinate-plane coordinate-plane-a" />
        <span className="coordinate-plane coordinate-plane-b" />
        <span className="orbital-arc orbital-arc-a" />
        <span className="orbital-arc orbital-arc-b" />
        <span className="gravity-ring gravity-ring-a" />
        <span className="gravity-ring gravity-ring-b" />
        <span className="constellation-line constellation-line-a" />
        <span className="constellation-line constellation-line-b" />
        <span className="constellation-line constellation-line-c" />
        <span className="science-marker science-marker-a" />
        <span className="science-marker science-marker-b" />
        <span className="science-marker science-marker-c" />
        <span className="radial-coordinate radial-coordinate-a" />
        <span className="radial-coordinate radial-coordinate-b" />
        <span className="refraction-line refraction-line-a" />
        <span className="refraction-line refraction-line-b" />
        <span className="haze-field haze-field-a" />
        <span className="haze-field haze-field-b" />
        <span className="light-band" />
      </div>

      <section className="hub" aria-labelledby="hub-title">
        <div className="profile-mark" aria-hidden="true">
          <img src="/assets/logo.png" width="72" height="72" alt="" decoding="async" />
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

      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={cursorFrameRef} className="cursor-frame" aria-hidden="true" />
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

function useCursor(stageRef, dotRef, frameRef) {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return undefined;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let frameX = pointerX;
    let frameY = pointerY;
    let smoothDriftX = 0;
    let smoothDriftY = 0;
    let targetDriftX = 0;
    let targetDriftY = 0;
    let animationFrame = 0;

    function setHovering(isHovering) {
      document.documentElement.toggleAttribute("data-cursor-active", isHovering);
    }

    function move(event) {
      pointerX = event.clientX;
      pointerY = event.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetDriftX = (pointerX - centerX) / centerX;
      targetDriftY = (pointerY - centerY) / centerY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      }
    }

    function render() {
      frameX += (pointerX - frameX) * 0.22;
      frameY += (pointerY - frameY) * 0.22;
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

      if (frameRef.current) {
        frameRef.current.style.transform = `translate3d(${frameX}px, ${frameY}px, 0) translate(-50%, -50%)`;
      }

      animationFrame = window.requestAnimationFrame(render);
    }

    const hoverTargets = Array.from(stageRef.current?.querySelectorAll("a, button") ?? []).map((target) => {
      const enter = () => setHovering(true);
      const leave = () => setHovering(false);
      target.addEventListener("mouseenter", enter);
      target.addEventListener("mouseleave", leave);
      return { target, enter, leave };
    });

    window.addEventListener("mousemove", move);
    render();

    return () => {
      window.removeEventListener("mousemove", move);
      hoverTargets.forEach(({ target, enter, leave }) => {
        target.removeEventListener("mouseenter", enter);
        target.removeEventListener("mouseleave", leave);
      });
      window.cancelAnimationFrame(animationFrame);
      document.documentElement.removeAttribute("data-cursor-active");
    };
  }, [dotRef, frameRef, stageRef]);
}

function useAtmosphere(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles = [];
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let lastFrame = performance.now();
    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      velocityX: 0,
      velocityY: 0,
      speed: 0,
      active: false,
    };

    function createParticle(index) {
      const z = 0.12 + Math.random() * 0.88;
      const depth = z * z;
      const x = Math.random() * width;
      const y = Math.random() * height;

      return {
        x,
        y,
        homeX: x,
        homeY: y,
        vx: 0,
        vy: 0,
        z,
        radius: 0.35 + depth * 1.45 + (index % 23 === 0 ? 0.55 : 0),
        alpha: 0.08 + depth * 0.32 + (index % 29 === 0 ? 0.1 : 0),
        hue: index % 8 === 0 ? 191 : index % 5 === 0 ? 235 : 210 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.00022 + Math.random() * 0.00032,
        orbit: Math.random() > 0.5 ? 1 : -1,
      };
    }

    function resize() {
      ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const particleCount = width < 560 ? 118 : width < 920 ? 168 : 228;
      particles = Array.from({ length: particleCount }, (_, index) => createParticle(index));
    }

    function movePointer(event) {
      const rect = canvas.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;

      pointer.velocityX = nextX - pointer.targetX;
      pointer.velocityY = nextY - pointer.targetY;
      pointer.speed += (Math.hypot(pointer.velocityX, pointer.velocityY) - pointer.speed) * 0.35;
      pointer.targetX = nextX;
      pointer.targetY = nextY;
      pointer.active = true;
    }

    function leavePointer() {
      pointer.active = false;
    }

    function drawNebula(time, isLight) {
      const driftX = Math.sin(time * 0.00006) * 0.045;
      const driftY = Math.cos(time * 0.00005) * 0.038;
      const primary = context.createRadialGradient(
        width * (0.24 + driftX * 0.08),
        height * (0.22 + driftY * 0.05),
        0,
        width * (0.24 + driftX * 0.08),
        height * (0.22 + driftY * 0.05),
        Math.max(width, height) * 0.72,
      );
      const secondary = context.createRadialGradient(
        width * (0.78 - driftX * 0.06),
        height * (0.72 - driftY * 0.08),
        0,
        width * (0.78 - driftX * 0.06),
        height * (0.72 - driftY * 0.08),
        Math.max(width, height) * 0.62,
      );

      primary.addColorStop(0, isLight ? "rgba(67, 128, 168, 0.075)" : "rgba(78, 166, 210, 0.13)");
      primary.addColorStop(0.42, isLight ? "rgba(95, 108, 176, 0.042)" : "rgba(108, 93, 188, 0.07)");
      primary.addColorStop(1, "rgba(0, 0, 0, 0)");

      secondary.addColorStop(0, isLight ? "rgba(37, 93, 127, 0.048)" : "rgba(33, 83, 138, 0.12)");
      secondary.addColorStop(0.48, isLight ? "rgba(112, 123, 176, 0.028)" : "rgba(94, 115, 210, 0.052)");
      secondary.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.globalCompositeOperation = isLight ? "source-over" : "lighter";
      context.fillStyle = primary;
      context.fillRect(0, 0, width, height);
      context.fillStyle = secondary;
      context.fillRect(0, 0, width, height);

      context.globalAlpha = isLight ? 0.035 : 0.052;
      context.strokeStyle = isLight ? "rgba(24, 72, 104, 0.24)" : "rgba(177, 226, 250, 0.28)";
      context.lineWidth = 1;
      context.beginPath();
      const waveY = height * (0.54 + Math.sin(time * 0.00008) * 0.05);
      context.moveTo(-40, waveY);
      for (let x = -40; x <= width + 40; x += 44) {
        const y = waveY + Math.sin(x * 0.007 + time * 0.0002) * 22 + driftY * height * 0.08;
        context.lineTo(x + driftX * 38, y);
      }
      context.stroke();
      context.globalAlpha = 1;
    }

    function render(now) {
      const isLight = document.documentElement.dataset.theme === "light";
      const delta = Math.min(32, now - lastFrame || 16.67);
      const step = reduceMotion ? 0.28 : delta / 16.67;
      lastFrame = now;

      pointer.x += (pointer.targetX - pointer.x) * 0.18;
      pointer.y += (pointer.targetY - pointer.y) * 0.18;
      pointer.speed *= 0.92;

      context.clearRect(0, 0, width, height);
      drawNebula(now, isLight);

      const fieldRadius = Math.min(340, Math.max(190, width * 0.24));
      const fieldRadiusSq = fieldRadius * fieldRadius;
      const parallaxX = pointer.active ? ((pointer.x - width / 2) / Math.max(width, 1)) * 22 : 0;
      const parallaxY = pointer.active ? ((pointer.y - height / 2) / Math.max(height, 1)) * 16 : 0;
      const pointerEnergy = Math.min(1.8, pointer.speed / 34);

      context.globalCompositeOperation = isLight ? "source-over" : "lighter";

      particles.forEach((particle, index) => {
        const depth = particle.z * particle.z;
        const noiseX =
          Math.sin(now * particle.driftSpeed + particle.phase) * (3 + depth * 16) +
          Math.sin(now * 0.00009 + particle.phase * 1.7) * (2 + depth * 8);
        const noiseY =
          Math.cos(now * particle.driftSpeed * 0.86 + particle.phase) * (3 + depth * 12) +
          Math.sin(now * 0.00007 + particle.phase * 2.1) * (2 + depth * 6);
        const targetX = particle.homeX + noiseX + parallaxX * (depth - 0.16);
        const targetY = particle.homeY + noiseY + parallaxY * (depth - 0.16);
        const homeForce = 0.001 + (1 - depth) * 0.00038;

        particle.vx += (targetX - particle.x) * homeForce * step;
        particle.vy += (targetY - particle.y) * homeForce * step;

        if (pointer.active && !reduceMotion) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < fieldRadiusSq) {
            const distance = Math.max(Math.sqrt(distanceSq), 0.01);
            const influence = (1 - distance / fieldRadius) ** 2;
            const nx = dx / distance;
            const ny = dy / distance;
            const force = influence * (0.11 + depth * 0.28) * (1 + pointerEnergy * 0.38);

            if (distance < fieldRadius * 0.28) {
              particle.vx -= nx * force * 1.8 * step;
              particle.vy -= ny * force * 1.8 * step;
            } else if (distance < fieldRadius * 0.62) {
              particle.vx += (-ny * particle.orbit + nx * 0.08) * force * 1.55 * step;
              particle.vy += (nx * particle.orbit + ny * 0.08) * force * 1.55 * step;
            } else {
              particle.vx += nx * force * 0.95 * step;
              particle.vy += ny * force * 0.95 * step;
            }
          }
        }

        particle.vx *= Math.pow(0.895 - depth * 0.028, step);
        particle.vy *= Math.pow(0.895 - depth * 0.028, step);
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;

        const twinkle = reduceMotion ? 0 : Math.sin(now * 0.0011 + particle.phase) * 0.055;
        const alpha = Math.max(0.025, particle.alpha + twinkle);
        const radius = particle.radius * (0.78 + depth * 0.72);
        const haloRadius = radius * (index % 17 === 0 ? 5.8 : 3.15);

        if (index % 3 !== 0) {
          context.beginPath();
          context.arc(particle.x, particle.y, haloRadius, 0, Math.PI * 2);
          context.fillStyle = isLight
            ? `hsla(${particle.hue}, 42%, 34%, ${alpha * 0.045})`
            : `hsla(${particle.hue}, 82%, 72%, ${alpha * 0.085})`;
          context.fill();
        }

        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fillStyle = isLight
          ? `hsla(${particle.hue}, 38%, 23%, ${alpha * 0.7})`
          : `hsla(${particle.hue}, 92%, 88%, ${alpha})`;
        context.fill();

        if (index % 31 === 0) {
          context.beginPath();
          context.arc(particle.x, particle.y, radius * 0.38, 0, Math.PI * 2);
          context.fillStyle = isLight ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.8)";
          context.fill();
        }
      });

      frame = window.requestAnimationFrame(render);
    }

    resize();
    render(lastFrame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("pointerleave", leavePointer);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerleave", leavePointer);
      window.cancelAnimationFrame(frame);
    };
  }, [canvasRef]);
}

export default App;
