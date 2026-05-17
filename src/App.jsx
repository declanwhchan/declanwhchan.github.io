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

  useAtmosphere(canvasRef);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("declan-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#02040b" : "#eef5fb");
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

function useAtmosphere(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false, desynchronized: true });
    if (!canvas || !context) return undefined;

    const backdrop = document.createElement("canvas");
    const fog = document.createElement("canvas");
    const backdropContext = backdrop.getContext("2d", { alpha: false });
    const fogContext = fog.getContext("2d", { alpha: true });
    if (!backdropContext || !fogContext) return undefined;

    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hardwareCores = navigator.hardwareConcurrency || 4;
    const deviceMemory = navigator.deviceMemory || 4;
    const lowPowerDevice = hardwareCores <= 4 || deviceMemory <= 4;
    const twoPi = Math.PI * 2;
    const colorSets = {
      dark: {
        particles: ["rgba(214, 250, 255, 1)", "rgba(136, 224, 255, 1)", "rgba(218, 190, 255, 1)", "rgba(255, 255, 255, 1)"],
        trails: ["rgba(112, 229, 255, 1)", "rgba(98, 181, 255, 1)", "rgba(180, 141, 255, 1)", "rgba(248, 253, 255, 1)"],
        stars: ["rgba(242, 252, 255, 1)", "rgba(192, 237, 255, 1)", "rgba(224, 204, 255, 1)", "rgba(255, 255, 255, 1)"],
      },
      light: {
        particles: ["rgba(0, 28, 58, 1)", "rgba(0, 53, 116, 1)", "rgba(42, 23, 116, 1)", "rgba(0, 12, 28, 1)"],
        trails: ["rgba(0, 75, 122, 1)", "rgba(0, 76, 157, 1)", "rgba(67, 43, 153, 1)", "rgba(0, 31, 64, 1)"],
        stars: ["rgba(0, 31, 61, 1)", "rgba(0, 73, 126, 1)", "rgba(58, 38, 136, 1)", "rgba(0, 12, 28, 1)"],
      },
    };

    let reduceMotion = motionQuery.matches;
    let width = 1;
    let height = 1;
    let ratio = 1;
    let frame = 0;
    let resizeFrame = 0;
    let currentTheme = "";
    let lastFrame = performance.now();
    let frameBudget = 16.67;
    let adaptiveQuality = lowPowerDevice ? 0.86 : 1;
    let lastQualityCheck = 0;
    let particleCount = 0;
    let starCount = 0;
    let particles = createParticleBuffers(0);
    let stars = createStarBuffers(0);
    const centers = [
      { baseX: 0.24, baseY: 0.35, rangeX: 0.036, rangeY: 0.026, phase: 0.6, speedX: 0.000026, speedY: 0.000021, strength: 2.1, orbit: 3.4, softening: 28000, spin: 1, x: 0, y: 0 },
      { baseX: 0.7, baseY: 0.46, rangeX: 0.028, rangeY: 0.032, phase: 2.4, speedX: 0.000021, speedY: 0.000018, strength: 1.7, orbit: 2.8, softening: 34000, spin: -1, x: 0, y: 0 },
      { baseX: 0.52, baseY: 0.76, rangeX: 0.034, rangeY: 0.022, phase: 4.2, speedX: 0.000018, speedY: 0.000024, strength: 1.35, orbit: 2.4, softening: 30000, spin: 1, x: 0, y: 0 },
    ];

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function makeSeededRandom(seedValue) {
      let seed = seedValue >>> 0;
      return () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
    }

    function getThemeKey() {
      return root.dataset.theme === "light" ? "light" : "dark";
    }

    function getPixelRatio() {
      const deviceRatio = window.devicePixelRatio || 1;
      if (reduceMotion) return 1;

      const cap = lowPowerDevice ? 1.08 : width < 760 ? 1.16 : 1.35;
      return Math.min(deviceRatio, cap);
    }

    function createParticleBuffers(count) {
      return {
        x: new Float32Array(count),
        y: new Float32Array(count),
        previousX: new Float32Array(count),
        previousY: new Float32Array(count),
        velocityX: new Float32Array(count),
        velocityY: new Float32Array(count),
        size: new Float32Array(count),
        alpha: new Float32Array(count),
        depth: new Float32Array(count),
        phase: new Float32Array(count),
        driftSpeed: new Float32Array(count),
        color: new Uint8Array(count),
        center: new Uint8Array(count),
      };
    }

    function createStarBuffers(count) {
      return {
        x: new Float32Array(count),
        y: new Float32Array(count),
        size: new Float32Array(count),
        alpha: new Float32Array(count),
        phase: new Float32Array(count),
        speed: new Float32Array(count),
        color: new Uint8Array(count),
      };
    }

    function calculateParticleCount() {
      const area = width * height;
      const minCount = width < 560 ? 54 : 78;
      const maxCount = lowPowerDevice ? 144 : 236;
      const base = clamp(Math.round(area / 9300), minCount, maxCount);
      const motionScale = reduceMotion ? 0.38 : 1;

      return Math.max(22, Math.round(base * adaptiveQuality * motionScale));
    }

    function calculateStarCount() {
      const area = width * height;
      const minCount = width < 560 ? 76 : 108;
      const maxCount = lowPowerDevice ? 220 : 340;
      const base = clamp(Math.round(area / 6200), minCount, maxCount);

      return Math.round(base * (reduceMotion ? 0.56 : 1));
    }

    function resetParticle(index) {
      const depth = 0.22 + Math.random() * 0.78;
      const sizeRoll = Math.random();
      const alphaRoll = Math.random();

      particles.x[index] = Math.random() * width;
      particles.y[index] = Math.random() * height;
      particles.previousX[index] = particles.x[index];
      particles.previousY[index] = particles.y[index];
      particles.velocityX[index] = (Math.random() - 0.5) * (0.045 + depth * 0.035);
      particles.velocityY[index] = (Math.random() - 0.5) * (0.035 + depth * 0.028);
      particles.size[index] =
        sizeRoll < 0.46
          ? 0.2 + depth * 0.48
          : sizeRoll < 0.88
            ? 0.58 + depth * 1.08
            : 1.35 + depth * 1.55;
      particles.alpha[index] = 0.12 + depth * 0.34 + (alphaRoll > 0.86 ? 0.12 : 0);
      particles.depth[index] = depth;
      particles.phase[index] = Math.random() * twoPi;
      particles.driftSpeed[index] = 0.00016 + Math.random() * 0.00026;
      particles.color[index] = Math.random() < 0.5 ? 0 : Math.random() < 0.76 ? 1 : Math.random() < 0.94 ? 2 : 3;
      particles.center[index] = Math.floor(Math.random() * centers.length);
    }

    function allocateParticles(nextCount, preserveExisting = false) {
      const previous = particles;
      const previousCount = particleCount;
      particles = createParticleBuffers(nextCount);
      particleCount = nextCount;

      if (preserveExisting && previousCount > 0) {
        const copyCount = Math.min(previousCount, nextCount);
        for (let index = 0; index < copyCount; index += 1) {
          particles.x[index] = clamp(previous.x[index], -80, width + 80);
          particles.y[index] = clamp(previous.y[index], -80, height + 80);
          particles.previousX[index] = particles.x[index];
          particles.previousY[index] = particles.y[index];
          particles.velocityX[index] = previous.velocityX[index];
          particles.velocityY[index] = previous.velocityY[index];
          particles.size[index] = previous.size[index];
          particles.alpha[index] = previous.alpha[index];
          particles.depth[index] = previous.depth[index];
          particles.phase[index] = previous.phase[index];
          particles.driftSpeed[index] = previous.driftSpeed[index];
          particles.color[index] = previous.color[index];
          particles.center[index] = previous.center[index];
        }

        for (let index = copyCount; index < nextCount; index += 1) {
          resetParticle(index);
        }

        return;
      }

      for (let index = 0; index < nextCount; index += 1) {
        resetParticle(index);
      }
    }

    function resetStar(index) {
      const sizeRoll = Math.random();
      stars.x[index] = Math.random() * width;
      stars.y[index] = Math.random() * height;
      stars.size[index] = sizeRoll < 0.62 ? 0.32 + Math.random() * 0.34 : sizeRoll < 0.92 ? 0.76 + Math.random() * 0.62 : 1.55 + Math.random() * 0.78;
      stars.alpha[index] = 0.18 + Math.random() * 0.5;
      stars.phase[index] = Math.random() * twoPi;
      stars.speed[index] = 0.00022 + Math.random() * 0.00072;
      stars.color[index] = Math.random() < 0.6 ? 0 : Math.random() < 0.82 ? 1 : Math.random() < 0.95 ? 2 : 3;
    }

    function allocateStars(nextCount) {
      stars = createStarBuffers(nextCount);
      starCount = nextCount;

      for (let index = 0; index < nextCount; index += 1) {
        resetStar(index);
      }
    }

    function paintRadialLayer(targetContext, x, y, radius, innerColor, middleColor, outerColor = "rgba(0, 0, 0, 0)") {
      const gradient = targetContext.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, innerColor);
      gradient.addColorStop(0.42, middleColor);
      gradient.addColorStop(1, outerColor);
      targetContext.fillStyle = gradient;
      targetContext.fillRect(0, 0, width, height);
    }

    function renderBackdrop(isLight) {
      backdrop.width = Math.max(1, Math.floor(width * ratio));
      backdrop.height = Math.max(1, Math.floor(height * ratio));
      backdropContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      backdropContext.clearRect(0, 0, width, height);

      const base = backdropContext.createLinearGradient(0, 0, width, height);
      if (isLight) {
        base.addColorStop(0, "#f8fcff");
        base.addColorStop(0.4, "#edf6fc");
        base.addColorStop(0.72, "#e2edf8");
        base.addColorStop(1, "#fbfdff");
      } else {
        base.addColorStop(0, "#01020a");
        base.addColorStop(0.36, "#030716");
        base.addColorStop(0.66, "#071123");
        base.addColorStop(1, "#02040b");
      }

      backdropContext.fillStyle = base;
      backdropContext.fillRect(0, 0, width, height);

      backdropContext.globalCompositeOperation = isLight ? "source-over" : "screen";
      paintRadialLayer(
        backdropContext,
        width * 0.2,
        height * 0.24,
        Math.max(width, height) * 0.72,
        isLight ? "rgba(58, 131, 170, 0.13)" : "rgba(35, 139, 190, 0.2)",
        isLight ? "rgba(58, 131, 170, 0.045)" : "rgba(35, 139, 190, 0.06)",
      );
      paintRadialLayer(
        backdropContext,
        width * 0.78,
        height * 0.67,
        Math.max(width, height) * 0.68,
        isLight ? "rgba(92, 95, 168, 0.105)" : "rgba(106, 72, 184, 0.145)",
        isLight ? "rgba(92, 95, 168, 0.034)" : "rgba(106, 72, 184, 0.044)",
      );
      paintRadialLayer(
        backdropContext,
        width * 0.5,
        height * 0.48,
        Math.max(width, height) * 0.54,
        isLight ? "rgba(25, 80, 123, 0.07)" : "rgba(16, 47, 96, 0.23)",
        isLight ? "rgba(25, 80, 123, 0.024)" : "rgba(16, 47, 96, 0.075)",
      );

      const rand = makeSeededRandom(Math.floor(width * 23 + height * 41 + (isLight ? 7 : 3)));
      const backgroundStars = clamp(Math.round((width * height) / 7600), width < 560 ? 70 : 100, lowPowerDevice ? 220 : 330);
      backdropContext.globalCompositeOperation = "source-over";
      backdropContext.fillStyle = isLight ? "rgba(18, 48, 76, 1)" : "rgba(226, 244, 255, 1)";

      for (let index = 0; index < backgroundStars; index += 1) {
        const starX = rand() * width;
        const starY = rand() * height;
        const size = rand() < 0.08 ? 1.15 : 0.58;
        backdropContext.globalAlpha = rand() * (isLight ? 0.14 : 0.34);
        backdropContext.fillRect(starX, starY, size, size);
      }

      backdropContext.globalAlpha = isLight ? 0.045 : 0.09;
      backdropContext.strokeStyle = isLight ? "rgba(30, 85, 122, 0.4)" : "rgba(149, 218, 247, 0.35)";
      backdropContext.lineWidth = 1;
      backdropContext.beginPath();
      const lensY = height * 0.56;
      backdropContext.moveTo(-30, lensY);
      for (let x = -30; x <= width + 30; x += 74) {
        backdropContext.lineTo(x, lensY + Math.sin(x * 0.012) * 12);
      }
      backdropContext.stroke();
      backdropContext.globalAlpha = 1;
    }

    function paintFogBlob(targetContext, fogWidth, fogHeight, x, y, radius, innerColor, middleColor) {
      const gradient = targetContext.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, innerColor);
      gradient.addColorStop(0.46, middleColor);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      targetContext.fillStyle = gradient;
      targetContext.fillRect(0, 0, fogWidth, fogHeight);
    }

    function renderFogTexture(isLight) {
      const fogScale = lowPowerDevice ? 0.34 : 0.42;
      const fogWidth = Math.max(1, Math.floor(width * fogScale));
      const fogHeight = Math.max(1, Math.floor(height * fogScale));
      fog.width = fogWidth;
      fog.height = fogHeight;
      fogContext.setTransform(1, 0, 0, 1, 0, 0);
      fogContext.clearRect(0, 0, fogWidth, fogHeight);
      fogContext.globalCompositeOperation = isLight ? "source-over" : "screen";

      paintFogBlob(
        fogContext,
        fogWidth,
        fogHeight,
        fogWidth * 0.24,
        fogHeight * 0.32,
        Math.max(fogWidth, fogHeight) * 0.58,
        isLight ? "rgba(48, 120, 160, 0.12)" : "rgba(25, 130, 188, 0.22)",
        isLight ? "rgba(48, 120, 160, 0.035)" : "rgba(25, 130, 188, 0.055)",
      );
      paintFogBlob(
        fogContext,
        fogWidth,
        fogHeight,
        fogWidth * 0.76,
        fogHeight * 0.58,
        Math.max(fogWidth, fogHeight) * 0.62,
        isLight ? "rgba(95, 88, 166, 0.105)" : "rgba(115, 80, 194, 0.17)",
        isLight ? "rgba(95, 88, 166, 0.034)" : "rgba(115, 80, 194, 0.044)",
      );
      paintFogBlob(
        fogContext,
        fogWidth,
        fogHeight,
        fogWidth * 0.48,
        fogHeight * 0.74,
        Math.max(fogWidth, fogHeight) * 0.48,
        isLight ? "rgba(28, 88, 124, 0.07)" : "rgba(45, 86, 152, 0.13)",
        isLight ? "rgba(28, 88, 124, 0.024)" : "rgba(45, 86, 152, 0.04)",
      );
      fogContext.globalAlpha = 1;
    }

    function renderSceneTextures(isLight) {
      // Static nebulae, fog, and background stars are cached so every
      // animation frame only draws two images plus the small live particle set.
      renderBackdrop(isLight);
      renderFogTexture(isLight);
    }

    function resize() {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      ratio = getPixelRatio();
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = true;

      currentTheme = getThemeKey();
      renderSceneTextures(currentTheme === "light");
      allocateStars(calculateStarCount());
      allocateParticles(calculateParticleCount());
    }

    function scheduleResize() {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    }

    function updateCenters(now) {
      for (let index = 0; index < centers.length; index += 1) {
        const center = centers[index];
        center.x = width * (center.baseX + Math.sin(now * center.speedX + center.phase) * center.rangeX);
        center.y = height * (center.baseY + Math.cos(now * center.speedY + center.phase) * center.rangeY);
      }
    }

    function drawFog(now, isLight) {
      if (!fog.width || !fog.height) return;

      const driftX = Math.sin(now * 0.000034) * width * 0.012;
      const driftY = Math.cos(now * 0.000029) * height * 0.014;

      context.save();
      context.globalCompositeOperation = isLight ? "source-over" : "screen";
      context.globalAlpha = isLight ? 0.48 : 0.62;
      context.translate(width / 2 + driftX, height / 2 + driftY);
      context.scale(1.045, 1.045);
      context.drawImage(fog, -width / 2, -height / 2, width, height);
      context.restore();
    }

    function drawTwinklingStars(now, themeKey) {
      const palette = colorSets[themeKey].stars;
      const isLight = themeKey === "light";

      context.globalCompositeOperation = isLight ? "source-over" : "screen";
      for (let index = 0; index < starCount; index += 1) {
        const twinkle = reduceMotion ? 0.72 : 0.68 + Math.sin(now * stars.speed[index] + stars.phase[index]) * 0.32;
        const alpha = stars.alpha[index] * twinkle * (isLight ? 1.02 : 1.16);
        const size = stars.size[index];

        context.globalAlpha = alpha;
        context.fillStyle = palette[stars.color[index]];
        context.fillRect(stars.x[index], stars.y[index], size, size);

        if (!reduceMotion && index % 31 === 0) {
          context.globalAlpha = alpha * 0.18;
          context.beginPath();
          context.arc(stars.x[index], stars.y[index], size * 3.4, 0, twoPi);
          context.fill();
        }
      }
      context.globalAlpha = 1;
    }

    function wrapParticle(index, margin) {
      if (particles.x[index] < -margin) {
        particles.x[index] = width + Math.random() * margin;
        particles.previousX[index] = particles.x[index];
        particles.velocityX[index] *= 0.35;
      } else if (particles.x[index] > width + margin) {
        particles.x[index] = -Math.random() * margin;
        particles.previousX[index] = particles.x[index];
        particles.velocityX[index] *= 0.35;
      }

      if (particles.y[index] < -margin) {
        particles.y[index] = height + Math.random() * margin;
        particles.previousY[index] = particles.y[index];
        particles.velocityY[index] *= 0.35;
      } else if (particles.y[index] > height + margin) {
        particles.y[index] = -Math.random() * margin;
        particles.previousY[index] = particles.y[index];
        particles.velocityY[index] *= 0.35;
      }
    }

    function drawParticles(now, step, themeKey) {
      const isLight = themeKey === "light";
      const palette = colorSets[themeKey];
      const margin = 92;

      context.globalCompositeOperation = isLight ? "source-over" : "screen";
      context.lineCap = "round";

      // This is intentionally O(n): no particle-to-particle or cursor forces,
      // only three cached attractors, so low-end GPUs avoid interaction spikes.
      for (let index = 0; index < particleCount; index += 1) {
        let particleX = particles.x[index];
        let particleY = particles.y[index];
        const previousX = particleX;
        const previousY = particleY;
        const depth = particles.depth[index];
        const center = centers[particles.center[index]];
        let accelerationX = Math.sin(now * particles.driftSpeed[index] + particles.phase[index]) * (0.0009 + depth * 0.0007);
        let accelerationY = Math.cos(now * particles.driftSpeed[index] * 0.86 + particles.phase[index]) * (0.00075 + depth * 0.0006);

        const centerDeltaX = center.x - particleX;
        const centerDeltaY = center.y - particleY;
        const centerDistance = centerDeltaX * centerDeltaX + centerDeltaY * centerDeltaY + center.softening;
        const gravity = (center.strength * depth) / centerDistance;
        const orbit = (center.orbit * depth * center.spin) / centerDistance;
        accelerationX += centerDeltaX * gravity - centerDeltaY * orbit;
        accelerationY += centerDeltaY * gravity + centerDeltaX * orbit;

        const damping = 0.988 - depth * 0.0045;
        let velocityX = (particles.velocityX[index] + accelerationX * step) * damping;
        let velocityY = (particles.velocityY[index] + accelerationY * step) * damping;
        const speedSq = velocityX * velocityX + velocityY * velocityY;
        const maxSpeed = 0.92 + depth * 0.82;

        if (speedSq > maxSpeed * maxSpeed) {
          const scale = maxSpeed / Math.sqrt(speedSq);
          velocityX *= scale;
          velocityY *= scale;
        }

        particleX += velocityX * step;
        particleY += velocityY * step;

        particles.x[index] = particleX;
        particles.y[index] = particleY;
        particles.velocityX[index] = velocityX;
        particles.velocityY[index] = velocityY;
        particles.previousX[index] = previousX;
        particles.previousY[index] = previousY;
        wrapParticle(index, margin);

        particleX = particles.x[index];
        particleY = particles.y[index];
        if (particleX < -10 || particleX > width + 10 || particleY < -10 || particleY > height + 10) {
          continue;
        }

        const particleAlpha =
          particles.alpha[index] *
          (reduceMotion ? 0.78 : 0.77 + Math.sin(now * 0.00078 + particles.phase[index]) * 0.23) *
          (isLight ? 1.04 : 1.18);
        const radius = particles.size[index] * (0.84 + depth * 0.26);
        const movementX = particleX - particles.previousX[index];
        const movementY = particleY - particles.previousY[index];
        const movementSq = movementX * movementX + movementY * movementY;
        const colorIndex = particles.color[index];

        if (!reduceMotion && movementSq > 0.012) {
          context.globalAlpha = particleAlpha * (isLight ? 0.2 : 0.32);
          context.strokeStyle = palette.trails[colorIndex];
          context.lineWidth = Math.max(0.55, radius * 0.58);
          context.beginPath();
          context.moveTo(particles.previousX[index], particles.previousY[index]);
          context.lineTo(particleX, particleY);
          context.stroke();
        }

        context.globalAlpha = particleAlpha;
        context.fillStyle = palette.particles[colorIndex];
        if (radius < 0.92) {
          context.fillRect(particleX, particleY, radius, radius);
        } else {
          context.beginPath();
          context.arc(particleX, particleY, radius, 0, twoPi);
          context.fill();
        }

        if (!reduceMotion && index % 37 === 0) {
          context.globalAlpha = particleAlpha * (isLight ? 0.055 : 0.09);
          context.beginPath();
          context.arc(particleX, particleY, radius * 3.6, 0, twoPi);
          context.fill();
        }
      }

      context.globalAlpha = 1;
    }

    function adaptQuality(delta, now) {
      if (reduceMotion) return;

      frameBudget += (delta - frameBudget) * 0.045;
      if (now - lastQualityCheck < 1800) return;

      lastQualityCheck = now;
      if (frameBudget > 21.5 && adaptiveQuality > 0.56) {
        adaptiveQuality = Math.max(0.56, adaptiveQuality * 0.84);
        allocateParticles(calculateParticleCount(), true);
      } else if (!lowPowerDevice && frameBudget < 15.8 && adaptiveQuality < 1) {
        adaptiveQuality = Math.min(1, adaptiveQuality + 0.06);
        allocateParticles(calculateParticleCount(), true);
      }
    }

    function render(now) {
      if (document.hidden) {
        lastFrame = now;
        frame = window.requestAnimationFrame(render);
        return;
      }

      const themeKey = getThemeKey();
      const isLight = themeKey === "light";
      if (themeKey !== currentTheme) {
        currentTheme = themeKey;
        renderSceneTextures(isLight);
      }

      const delta = Math.min(34, now - lastFrame || 16.67);
      const step = reduceMotion ? Math.min(delta / 16.67, 0.55) * 0.38 : delta / 16.67;
      lastFrame = now;

      updateCenters(now);
      context.clearRect(0, 0, width, height);
      context.drawImage(backdrop, 0, 0, width, height);
      drawFog(now, isLight);
      drawTwinklingStars(now, themeKey);
      drawParticles(now, step, themeKey);
      adaptQuality(delta, now);

      frame = window.requestAnimationFrame(render);
    }

    function handleMotionChange(event) {
      reduceMotion = event.matches;
      adaptiveQuality = lowPowerDevice ? 0.86 : 1;
      resize();
    }

    function handleVisibilityChange() {
      lastFrame = performance.now();
    }

    resize();
    render(lastFrame);
    window.addEventListener("resize", scheduleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionChange);
    } else {
      motionQuery.addListener(handleMotionChange);
    }

    return () => {
      window.removeEventListener("resize", scheduleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionChange);
      } else {
        motionQuery.removeListener(handleMotionChange);
      }
      window.cancelAnimationFrame(resizeFrame);
      window.cancelAnimationFrame(frame);
    };
  }, [canvasRef]);
}

export default App;
