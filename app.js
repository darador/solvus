/* ==========================================================================
   SOLVUS INTERACTION LOGIC
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
                navMenu.style.top = '72px';
                navMenu.style.left = '0';
                navMenu.style.width = '100%';
                navMenu.style.background = 'rgba(7, 7, 9, 0.95)';
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
        const numParticles = 40;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.4)';
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
            ctx.lineWidth = 1;

            // Draw lines
            for (let i = 0; i < numParticles; i++) {
                for (let j = i + 1; j < numParticles; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 120) {
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

    // --- SCROLL ANIMATED STATS COUNTER ---
    const stats = document.querySelectorAll('.stat-num');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-val'), 10);
        let current = 0;
        const duration = 1500;
        const increment = target / (duration / 16); // ~60fps
        
        const updateCount = () => {
            current += increment;
            if (current >= target) {
                element.innerText = target === 100 ? 'AMBA' : (target === 99 ? '99%' : (target === 24 ? '24hs' : `+${target}`));
            } else {
                element.innerText = target === 100 ? 'AMBA' : (target === 99 ? `${Math.floor(current)}%` : (target === 24 ? `${Math.floor(current)}hs` : `+${Math.floor(current)}`));
                requestAnimationFrame(updateCount);
            }
        };
        updateCount();
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));

    // --- TESTIMONIAL CAROUSEL ---
    const track = document.getElementById('testimonialTrack');
    const slides = Array.from(track ? track.children : []);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    let currentIndex = 0;

    const updateCarousel = (index) => {
        if (!track || slides.length === 0) return;
        track.style.transform = `translateX(-${index * 100}%)`;
    };

    if (nextButton && prevButton && slides.length > 0) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(currentIndex);
        });

        // Auto transition every 6 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel(currentIndex);
        }, 6000);
    }

    // --- INTERACTIVE COVERAGE MAP ZONE SELECTOR ---
    const zoneData = {
        "Quilmes": {
            title: "Quilmes",
            desc: "Zona clave de operaciones. Tiempo de respuesta técnica promedio para soporte presencial o urgencias de alarmas: menor a 2 horas. Cobertura completa en Quilmes Centro, Bernal y Quilmes Oeste."
        },
        "Berazategui": {
            title: "Berazategui",
            desc: "Nuestra central operativa se encuentra en la región. Soporte técnico inmediato 24/7. Proyectos corporativos y residenciales con relevamiento en el mismo día."
        },
        "Hudson": {
            title: "Hudson & Clubes de Campo",
            desc: "Especialistas en la protección de barrios cerrados y clubes de campo (Abril, Fincas, El Carmen). Redes estructuradas estables con fibra interna y cámaras IP perimetrales de alta gama."
        },
        "Florencio Varela": {
            title: "Florencio Varela",
            desc: "Cobertura completa en áreas urbanas e industriales. Relevamientos y diagnósticos de conectividad de mediano y gran porte listos dentro de las 24 horas hábiles."
        }
    };

    const mapMarkers = document.querySelectorAll('.map-marker');
    const activeZoneTitle = document.getElementById('activeZoneTitle');
    const activeZoneDesc = document.getElementById('activeZoneDesc');

    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const zoneName = marker.getAttribute('data-zone');
            const data = zoneData[zoneName];
            
            if (data && activeZoneTitle && activeZoneDesc) {
                // Glow effect to the selected marker
                mapMarkers.forEach(m => m.querySelector('.main').style.fill = 'var(--secondary)');
                marker.querySelector('.main').style.fill = '#10B981'; // Green for highlighted active zone
                
                // Content transition
                activeZoneTitle.style.opacity = '0';
                activeZoneDesc.style.opacity = '0';
                
                setTimeout(() => {
                    activeZoneTitle.innerText = data.title;
                    activeZoneDesc.innerText = data.desc;
                    activeZoneTitle.style.opacity = '1';
                    activeZoneDesc.style.opacity = '1';
                }, 200);
            }
        });
    });

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
            const formCard = leadForm;
            formCard.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-pure);">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); color: var(--success); display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 20px;">
                        ✓
                    </div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 12px; color: var(--text-pure);">¡Solicitud Recibida, ${name}!</h3>
                    <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 0.95rem;">Un asesor técnico de Solvus analizará tu solicitud para <strong>${service}</strong> en <strong>${location}</strong> y te contactará por teléfono al <strong>${phone}</strong> dentro de las próximas 2 horas hábiles.</p>
                    <a href="https://wa.me/5491100000000?text=Hola!%20Acabo%20de%20enviar%20una%20solicitud%20para%20${service}%20en%20${location}" target="_blank" class="btn btn-whatsapp">
                        Acelerar contacto por WhatsApp
                    </a>
                </div>
            `;
        });
    }

});
