import { useEffect, useRef } from "react";

/**
 * High-performance animated background canvas.
 * Renders an ambient constellation mesh and energy orbs in Jet Black with
 * Cerulean Blue (#00c2ff) and Neon Rose (#ff007f) accents that react to stress levels.
 */
export default function BackgroundCanvas({ stressScore = 0, stressState = "calm" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for gentle interactive attractor
    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Particle nodes
    const particleCount = Math.min(65, Math.floor((width * height) / 22000));
    let particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2.2 + 1;
        // Bias towards cerulean blue or neon rose
        this.isRose = Math.random() < (stressScore > 50 ? 0.65 : 0.3);
        this.alpha = Math.random() * 0.5 + 0.25;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.025 + 0.015;
      }

      update(speedMultiplier, roseRatio) {
        this.pulse += this.pulseSpeed * speedMultiplier;
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;

        // Wrap edges
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        // Interactive mouse gravity
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            this.x -= (dx / dist) * force * 0.8;
            this.y -= (dy / dist) * force * 0.8;
          }
        }
      }

      draw(context) {
        const currentAlpha = Math.max(0.15, this.alpha + Math.sin(this.pulse) * 0.25);
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        if (this.isRose) {
          context.fillStyle = `rgba(255, 0, 127, ${currentAlpha})`;
          context.shadowColor = "rgba(255, 0, 127, 0.6)";
        } else {
          context.fillStyle = `rgba(0, 194, 255, ${currentAlpha})`;
          context.shadowColor = "rgba(0, 194, 255, 0.6)";
        }
        context.shadowBlur = this.radius * 3.5;
        context.fill();
        context.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    // Ambient orbs
    let orbTime = 0;

    const render = () => {
      orbTime += 0.008;

      // Deep Jet Black Base (#040508)
      ctx.fillStyle = "#040508";
      ctx.fillRect(0, 0, width, height);

      // Radial Ambient Glowing Orbs
      // Orb 1: Cerulean Blue in top-left quadrant
      const orb1X = width * 0.25 + Math.sin(orbTime * 0.7) * 120;
      const orb1Y = height * 0.3 + Math.cos(orbTime * 0.5) * 80;
      const rad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, Math.max(width * 0.45, 300));
      rad1.addColorStop(0, "rgba(0, 168, 232, 0.16)");
      rad1.addColorStop(0.5, "rgba(0, 123, 167, 0.05)");
      rad1.addColorStop(1, "rgba(4, 5, 8, 0)");
      ctx.fillStyle = rad1;
      ctx.fillRect(0, 0, width, height);

      // Orb 2: Neon Rose in bottom-right quadrant (intensifies with stress)
      const roseIntensity = Math.min(0.32, 0.08 + (stressScore / 100) * 0.22);
      const orb2X = width * 0.78 + Math.cos(orbTime * 0.6) * 140;
      const orb2Y = height * 0.65 + Math.sin(orbTime * 0.8) * 100;
      const rad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, Math.max(width * 0.4, 280));
      rad2.addColorStop(0, `rgba(255, 0, 127, ${roseIntensity})`);
      rad2.addColorStop(0.5, `rgba(255, 20, 147, ${roseIntensity * 0.3})`);
      rad2.addColorStop(1, "rgba(4, 5, 8, 0)");
      ctx.fillStyle = rad2;
      ctx.fillRect(0, 0, width, height);

      // Dynamic speed multiplier from stress
      const speedMultiplier = 1.0 + (stressScore / 100) * 1.6;

      // Draw particle connections
      const maxDist = 125;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (particles[i].isRose || particles[j].isRose) {
              ctx.strokeStyle = `rgba(255, 0, 127, ${lineAlpha * 1.2})`;
            } else {
              ctx.strokeStyle = `rgba(0, 194, 255, ${lineAlpha})`;
            }
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update(speedMultiplier);
        p.draw(ctx);
      });

      // If stress is critical, add subtle perimeter heartbeat glow
      if (stressScore >= 75) {
        const pulseAlpha = Math.sin(Date.now() * 0.005) * 0.07 + 0.08;
        ctx.strokeStyle = `rgba(255, 0, 127, ${pulseAlpha})`;
        ctx.lineWidth = 14;
        ctx.strokeRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [stressScore, stressState]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
