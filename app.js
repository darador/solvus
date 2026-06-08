/* ==========================================================================
   SOLVUS INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE MENU TOGGLE ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- ACTIVE NAVIGATION HIGHLIGHT ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        let scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Run once initially

    // --- PRESUPUESTO MODAL TRIGGER ---
    const budgetModal = document.getElementById('presupuestoModal');
    const openModalButtons = [
        document.getElementById('btnPresupuestoHeader'),
        document.getElementById('btnPresupuestoHero'),
        document.getElementById('btnOpenPresupuestoModal')
    ];
    const closeModalButton = document.getElementById('btnCloseModal');

    // Open Modal
    openModalButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                // If it is an anchor link to #contacto (on mobile / fallbacks), we prevent default to show modal
                e.preventDefault();
                if (budgetModal) {
                    budgetModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Lock background scrolling
                }
            });
        }
    });

    // Close Modal Function
    function closeModal() {
        if (budgetModal) {
            budgetModal.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scrolling
        }
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Close Modal on clicking outside the dialog content
    if (budgetModal) {
        budgetModal.addEventListener('click', (e) => {
            if (e.target === budgetModal) {
                closeModal();
            }
        });
    }

    // --- FORM CONVERSION SUBMISSION ---
    const leadForm = document.getElementById('leadForm');
    const modalFormContainer = document.getElementById('modalFormContainer');

    if (leadForm && modalFormContainer) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const location = document.getElementById('location').value;

            // Render a premium success state inside the modal
            modalFormContainer.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: #DCFCE7; color: #15803D; display: inline-flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 20px;">
                        ✓
                    </div>
                    <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary);">¡Solicitud Recibida, ${name}!</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 0.95rem; line-height: 1.5;">
                        Analizaremos tus necesidades de <strong>${service}</strong> en <strong>${location}</strong>. Te enviaremos una cotización técnica detallada a la brevedad.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; margin: 0 auto;">
                        <a href="https://wa.me/5491123455678?text=Hola!%20Acabo%20de%20solicitar%20un%20presupuesto%20para%20${encodeURIComponent(service)}%20en%20${encodeURIComponent(location)}.%20Mi%20nombre%20es%20${encodeURIComponent(name)}." target="_blank" class="btn btn-whatsapp-hero" style="width: 100%;">
                            Acelerar por WhatsApp
                        </a>
                        <button type="button" class="btn btn-secondary-outline" onclick="location.reload()" style="width: 100%;">
                            Cerrar Ventana
                        </button>
                    </div>
                </div>
            `;
        });
    }

});
