/* ==========================================================================
   SOLVUS INTERACTION LOGIC (SIMPLIFIED)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE MENU TOGGLE ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isVisible = navMenu.style.display === 'flex';
            navMenu.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '68px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.background = '#0F172A';
                navMenu.style.borderBottom = '1px solid var(--border-color)';
                navMenu.style.padding = '20px';
                navMenu.style.zIndex = '999';
            }
        });
    }

    // --- HERO BACKGROUND PARTICLES (NETWORKING) ---
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });

        const particles = [];
        const numParticles = 35;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
            ctx.lineWidth = 1;

            // Draw lines
            for (let i = 0; i < numParticles; i++) {
                for (let j = i + 1; j < numParticles; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (let i = 0; i < numParticles; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            }

            requestAnimationFrame(draw);
        }
        draw();
    }

    // --- LEAD FORM CAPTURE & CONVERSION SUCCESS ---
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const location = document.getElementById('location').value;
            
            // Visual trust feedback upon conversion success
            leadForm.innerHTML = `
                <div style="text-align: center; padding: 30px 10px; color: var(--text-pure);">
                    <div style="width: 54px; height: 54px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); color: var(--success); display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 16px;">
                        ✓
                    </div>
                    <h3 style="font-size: 1.35rem; margin-bottom: 10px; color: var(--text-pure);">¡Solicitud Recibida, ${name}!</h3>
                    <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem;">Analizaremos tu requerimiento para <strong>${service}</strong> en <strong>${location}</strong> y te contactaremos por WhatsApp o llamada al <strong>${phone}</strong> a la brevedad.</p>
                    <a href="https://wa.me/5491100000000?text=Hola!%20Acabo%20de%20enviar%20una%20solicitud%20para%20${service}%20en%20${location}" target="_blank" class="btn btn-whatsapp">
                        Acelerar por WhatsApp
                    </a>
                </div>
            `;
        });
    }

});
