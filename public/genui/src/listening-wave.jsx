/* ListeningWaveCanvas — canvas-based animated gradient wave
 * Adapted from the Live Chat reference prototype. Used as the
 * background of the LiveChatOverlay when the assistant is actively
 * listening / thinking / responding.
 *
 *   width:    px
 *   height:   px
 *   mode:     "listening" | "thinking" | "waiting" | "speaking"
 *   radius:   px (border-radius on the canvas element)
 *   transparent: if true, no solid bg fill (overlays its own bg)
 */
(function () {
  const { useRef, useEffect } = React;

  function ListeningWaveCanvas({ width, height, mode = "listening", radius = 16, transparent = false }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const dpr = 2;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const C = {
        bg: "#F5EAFB",
        bgIdle: "#EDE2F7",
        info: "#A9C3F2",
        lavMid: "#A07CCF",
        lavLight: "#DCC8EE",
        lavMed: "#C4A8E0",
        lavDark: "#8B5CB8",
        blueSat: "#7FBDFA",
        coral: "#F08882",
        pink: "#F0ABA6",
        blueSky: "#B1D7FE",
        purple: "#B287D8",
        purpleSat: "#C9A4EA",
      };

      const W = width, H = height;

      const smoothWave = (yBase, amp, freq, phase, speed, t) => {
        const pts = [];
        const n = 7;
        for (let i = -1; i <= n + 1; i++) {
          const nx = i / n;
          const y = yBase +
            Math.sin(nx * Math.PI * freq + t * speed + phase) * amp +
            Math.cos(nx * Math.PI * freq * 0.6 + t * speed * 0.5 + phase * 1.8) * (amp * 0.4);
          pts.push({ x: nx * W, y });
        }
        ctx.beginPath();
        ctx.moveTo(-10, H + 10);
        ctx.lineTo(pts[1].x, pts[1].y);
        const tension = 0.35;
        for (let i = 1; i < pts.length - 2; i++) {
          const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2];
          ctx.bezierCurveTo(
            p1.x + (p2.x - p0.x) * tension, p1.y + (p2.y - p0.y) * tension,
            p2.x - (p3.x - p1.x) * tension, p2.y - (p3.y - p1.y) * tension,
            p2.x, p2.y
          );
        }
        ctx.lineTo(W + 10, H + 10);
        ctx.closePath();
      };

      let start = null;
      const draw = (ts) => {
        if (!start) start = ts;
        const t = (ts - start) * 0.001;
        ctx.clearRect(0, 0, W, H);

        if (mode === "thinking") {
          if (!transparent) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); }
          ctx.save(); ctx.filter = "blur(24px)";
          smoothWave(H * 0.3, 14, 1.1, 0.4, 2.0, t);
          ctx.fillStyle = C.info; ctx.fill(); ctx.restore();
          ctx.save(); ctx.filter = "blur(22px)";
          smoothWave(H * 0.42, 18, 1.3, 1.2, 2.4, t);
          ctx.fillStyle = C.lavMid; ctx.fill(); ctx.restore();
        } else if (mode === "waiting") {
          if (!transparent) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); }
          ctx.save(); ctx.filter = "blur(16px)";
          smoothWave(H * 0.5, 11, 1.0, 0.8, 0.85, t);
          ctx.fillStyle = C.lavLight; ctx.fill(); ctx.restore();
          ctx.save(); ctx.filter = "blur(14px)";
          smoothWave(H * 0.45, 12, 1.1, 1.8, 1.05, t);
          ctx.fillStyle = C.lavMed; ctx.fill(); ctx.restore();
        } else if (mode === "speaking") {
          if (!transparent) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H); }
          ctx.save(); ctx.filter = "blur(14px)";
          smoothWave(H * 0.35, 18, 1.3, 0.8, 2.4, t);
          ctx.fillStyle = C.lavLight; ctx.fill(); ctx.restore();
          ctx.save(); ctx.filter = "blur(12px)";
          smoothWave(H * 0.55, 16, 1.4, 1.8, 2.8, t);
          ctx.fillStyle = C.purpleSat; ctx.fill(); ctx.restore();
        } else {
          // listening (label: "Responding" - the colorful one, fluid playback)
          if (!transparent) { ctx.fillStyle = C.bgIdle; ctx.fillRect(0, 0, W, H); }
          ctx.save(); ctx.filter = "blur(30px)";
          smoothWave(H * 0.5, 18, 1.4, 0.5, 3.6, t);
          ctx.fillStyle = C.blueSat; ctx.fill(); ctx.restore();
          ctx.save(); ctx.filter = "blur(34px)";
          smoothWave(H * 0.42, 20, 1.2, 3.2, 3.2, t);
          ctx.fillStyle = C.coral; ctx.fill(); ctx.restore();
          ctx.save(); ctx.filter = "blur(26px)";
          smoothWave(H * 0.55, 16, 1.6, 1.8, 3.8, t);
          ctx.fillStyle = C.lavDark; ctx.fill(); ctx.restore();
          ctx.save(); ctx.filter = "blur(22px)";
          smoothWave(H * 0.65, 11, 1.9, 4.0, 4.4, t);
          ctx.fillStyle = C.lavMid; ctx.fill(); ctx.restore();
        }

        // grain
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 80; i++) {
          const x = Math.random() * W, y = Math.random() * H;
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.globalAlpha = 1;

        rafRef.current = requestAnimationFrame(draw);
      };
      rafRef.current = requestAnimationFrame(draw);
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [width, height, mode, transparent]);

    return <canvas ref={canvasRef} style={{ width, height, display: "block", borderRadius: radius }}/>;
  }

  Object.assign(window, { ListeningWaveCanvas });
})();
