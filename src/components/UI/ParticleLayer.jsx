
import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

// ─── Holi Particle System ───────────────────────────────────────────────────
function runHoliParticles(canvas, ctx) {
    const colors = ['#FF006E', '#00B4D8', '#FFD60A', '#06D6A0', '#FB5607', '#8338EC'];
    const particles = [];
    let animId;

    class Particle {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : -20;
            this.r = Math.random() * 14 + 6;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.05;
            this.shape = Math.random() > 0.5 ? 'circle' : 'blob';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.ellipse(0, 0, this.r, this.r * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

// ─── Diwali Sparkle System ──────────────────────────────────────────────────
function runDiwaliParticles(canvas, ctx) {
    const particles = [];
    let animId;

    class Sparkle {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
            this.size = Math.random() * 3 + 1;
            this.color = Math.random() > 0.5 ? '#FFD700' : Math.random() > 0.5 ? '#FF6B00' : '#FFF8E7';
            this.vy = -(Math.random() * 1.5 + 0.5);
            this.vx = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random();
            this.life = Math.random();
            this.lifeSpeed = Math.random() * 0.01 + 0.005;
            this.twinkle = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.twinkle += 0.08;
            this.opacity = (Math.sin(this.twinkle) + 1) / 2;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity * 0.8;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 6;
            // Draw 4-point star
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const outerX = Math.cos(angle) * this.size * 2;
                const outerY = Math.sin(angle) * this.size * 2;
                const innerAngle = angle + Math.PI / 4;
                const innerX = Math.cos(innerAngle) * this.size * 0.5;
                const innerY = Math.sin(innerAngle) * this.size * 0.5;
                if (i === 0) ctx.moveTo(outerX, outerY);
                else ctx.lineTo(outerX, outerY);
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Firework burst
    class Firework {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.6;
            this.particles = [];
            this.active = false;
            this.timer = Math.random() * 200;
            this.color = ['#FFD700', '#FF6B00', '#FF0000', '#FFF8E7'][Math.floor(Math.random() * 4)];
        }
        burst() {
            this.active = true;
            this.particles = [];
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                this.particles.push({
                    x: this.x, y: this.y,
                    vx: Math.cos(angle) * (Math.random() * 3 + 1),
                    vy: Math.sin(angle) * (Math.random() * 3 + 1),
                    life: 1, color: this.color
                });
            }
        }
        update() {
            if (!this.active) {
                this.timer--;
                if (this.timer <= 0) this.burst();
                return;
            }
            this.particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                p.vy += 0.05;
                p.life -= 0.02;
                p.vx *= 0.98; p.vy *= 0.98;
            });
            this.particles = this.particles.filter(p => p.life > 0);
            if (this.particles.length === 0) this.reset();
        }
        draw() {
            this.particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.life * 0.8;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Sparkle());
    const fireworks = [new Firework(), new Firework(), new Firework()];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        fireworks.forEach(f => { f.update(); f.draw(); });
        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

// ─── Navratri Mandala System ─────────────────────────────────────────────────
function runNavratriParticles(canvas, ctx) {
    let animId;
    let rotation = 0;
    const colors = ['#DC267F', '#7C3AED', '#F59E0B', '#06D6A0', '#EF4444', '#3B82F6'];

    function drawMandala(cx, cy, r, rot, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        const petals = 8;
        for (let i = 0; i < petals; i++) {
            const angle = (i / petals) * Math.PI * 2;
            const color = colors[i % colors.length];
            ctx.save();
            ctx.rotate(angle);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(r * 0.5, 0, r * 0.3, r * 0.12, 0, 0, Math.PI * 2);
            ctx.fill();
            // Inner dot
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(r * 0.5, 0, r * 0.04, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        // Center circle
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = colors[Math.floor(rotation * 0.5) % colors.length];
        ctx.fill();
        ctx.restore();
    }

    // Orbiting color dots
    const orbs = Array.from({ length: 12 }, (_, i) => ({
        angle: (i / 12) * Math.PI * 2,
        speed: (Math.random() * 0.005 + 0.003) * (i % 2 === 0 ? 1 : -1),
        r: Math.random() * 6 + 4,
        orbitR: Math.random() * 80 + 60,
        color: colors[i % colors.length],
        cx: canvas.width * 0.5,
        cy: canvas.height * 0.5,
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rotation += 0.003;

        // Corner mandalas
        const corners = [
            [80, 80], [canvas.width - 80, 80],
            [80, canvas.height - 80], [canvas.width - 80, canvas.height - 80],
        ];
        corners.forEach(([cx, cy]) => {
            drawMandala(cx, cy, 60, rotation, 0.15);
            drawMandala(cx, cy, 35, -rotation * 1.5, 0.1);
        });

        // Center large mandala
        drawMandala(canvas.width / 2, canvas.height / 2, 120, rotation * 0.5, 0.08);
        drawMandala(canvas.width / 2, canvas.height / 2, 70, -rotation, 0.06);

        // Orbiting dots
        orbs.forEach(orb => {
            orb.angle += orb.speed;
            const x = orb.cx + Math.cos(orb.angle) * orb.orbitR;
            const y = orb.cy + Math.sin(orb.angle) * orb.orbitR;
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = orb.color;
            ctx.shadowColor = orb.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, orb.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

// ─── Main Component ──────────────────────────────────────────────────────────
const ParticleLayer = () => {
    const { theme } = useTheme();
    const canvasRef = useRef(null);
    const cleanupRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Cleanup previous animation
        if (cleanupRef.current) cleanupRef.current();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (theme === 'holi') {
            cleanupRef.current = runHoliParticles(canvas, ctx);
        } else if (theme === 'diwali') {
            cleanupRef.current = runDiwaliParticles(canvas, ctx);
        } else if (theme === 'navratri') {
            cleanupRef.current = runNavratriParticles(canvas, ctx);
        } else {
            cleanupRef.current = null;
        }

        return () => {
            window.removeEventListener('resize', resize);
            if (cleanupRef.current) cleanupRef.current();
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            id="festival-canvas"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        />
    );
};

export default ParticleLayer;
