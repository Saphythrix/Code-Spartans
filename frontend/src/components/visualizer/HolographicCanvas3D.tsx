import React, { useEffect, useRef } from 'react';
import { useStream } from '../../context/StreamContext';

export const HolographicCanvas3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { currentEmotion, eyeAttention, fusion } = useStream();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for 3D simulation
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * width * 0.8,
      y: (Math.random() - 0.5) * height * 0.8,
      z: Math.random() * width,
      size: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      vz: (Math.random() - 0.5) * 1.5,
    }));

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const focalLength = width * 0.6;
      const centerX = width / 2;
      const centerY = height / 2;

      // Color scheme based on live emotion state
      const emotion = (currentEmotion?.emotion || 'happy').toLowerCase();
      let primaryColor = '99, 102, 241'; // Indigo default
      let glowColor = '0, 229, 255';    // Cyan

      if (emotion === 'happy') {
        primaryColor = '16, 185, 129'; // Emerald
        glowColor = '52, 211, 153';
      } else if (emotion === 'confused') {
        primaryColor = '245, 158, 11'; // Amber
        glowColor = '251, 191, 36';
      } else if (emotion === 'bored') {
        primaryColor = '168, 85, 247'; // Purple
        glowColor = '192, 132, 252';
      } else if (emotion === 'sad') {
        primaryColor = '6, 182, 212';  // Cyan
        glowColor = '103, 232, 249';
      }

      angleX += 0.005;
      angleY += 0.008;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Render 3D spatial particles & connection mesh
      const projected: Array<{ x: number; y: number; scale: number }> = [];

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (Math.abs(p.x) > width * 0.5) p.vx *= -1;
        if (Math.abs(p.y) > height * 0.5) p.vy *= -1;
        if (p.z < 10 || p.z > width) p.vz *= -1;

        // 3D rotation matrix transform
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.y * sinX + p.z * cosX;

        let x2 = p.x * cosY + z1 * sinY;
        let z2 = -p.x * sinY + z1 * cosY;

        const scale = focalLength / (focalLength + z2 + width * 0.4);
        const px = centerX + x2 * scale;
        const py = centerY + y1 * scale;

        projected.push({ x: px, y: py, scale });

        // Draw particle node
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, p.size * scale * 1.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glowColor}, ${Math.min(1, scale * 1.2)})`;
        ctx.shadowColor = `rgb(${glowColor})`;
        ctx.shadowBlur = 10 * scale;
        ctx.fill();
      });

      // Draw 3D Spatial Connecting Mesh Lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            const alpha = (1 - dist / 75) * 0.35 * projected[i].scale;
            ctx.strokeStyle = `rgba(${primaryColor}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Center Holographic Core Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38 + Math.sin(angleX * 4) * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${glowColor}, 0.5)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentEmotion?.emotion]);

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden glass-card border border-primary-500/30 flex items-center justify-center bg-surface/90 shadow-2xl group">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Holographic Center Overlay Text */}
      <div className="relative z-10 text-center backdrop-blur-sm px-4 py-2 rounded-xl bg-black/40 border border-white/10">
        <p className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">3D Emotion Spatial Core</p>
        <h4 className="text-base font-bold text-white capitalize mt-0.5">{currentEmotion?.emotion || 'Happy'}</h4>
        <p className="text-[10px] text-gray-400 font-mono">
          Engagement: {(fusion?.engagement ?? 85).toFixed(0)}%
        </p>
      </div>
    </div>
  );
};
