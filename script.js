/**
 * Afrique'Art - Site Vitrine
 * JavaScript Vanilla - Navigation, formulaire, accessibilité
 */

(function() {
    'use strict';

    // ================================================================
    // 1. HEADER SCROLL SHADOW
    // ================================================================
    const header = document.querySelector('.header');

    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ================================================================
    // 2. MENU MOBILE
    // ================================================================
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            // Empêcher le scroll du body quand le menu est ouvert
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Fermer le menu au clic sur un lien
        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Fermer le menu au clic à l'extérieur
        document.addEventListener('click', function(e) {
            const headerEl = document.querySelector('.header');
            if (headerEl && !headerEl.contains(e.target) && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Fermer le menu avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                navToggle.focus();
            }
        });
    }

    // ================================================================
    // 3. FORMULAIRE DE CONTACT - Validation complète
    // ================================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Références aux champs
        const fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            service: document.getElementById('service'),
            message: document.getElementById('message')
        };

        // Validation en temps réel (on blur)
        Object.values(fields).forEach(function(input) {
            if (input) {
                input.addEventListener('blur', function() {
                    validateField(input);
                });
                input.addEventListener('input', function() {
                    // Supprimer l'erreur au fur et à mesure que l'utilisateur tape
                    const formGroup = input.closest('.form-group');
                    if (formGroup && formGroup.classList.contains('error')) {
                        if (input.id === 'email' && isValidEmail(input.value.trim())) {
                            formGroup.classList.remove('error');
                        } else if (input.id === 'name' && input.value.trim().length > 0) {
                            formGroup.classList.remove('error');
                        } else if (input.id === 'message' && input.value.trim().length > 0) {
                            formGroup.classList.remove('error');
                        } else if (input.id === 'service' && input.value !== '') {
                            formGroup.classList.remove('error');
                        } else if (input.id === 'phone' && (input.value.trim() === '' || isValidPhone(input.value.trim()))) {
                            formGroup.classList.remove('error');
                        }
                    }
                });
            }
        });

        // Soumission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Réinitialiser les erreurs
            clearErrors();

            let isValid = true;

            // Valider tous les champs requis
            if (!validateField(fields.name)) isValid = false;
            if (!validateField(fields.email)) isValid = false;
            if (!validateField(fields.service)) isValid = false;
            if (!validateField(fields.message)) isValid = false;

            // Validation du téléphone (optionnel mais avec format si rempli)
            if (fields.phone && fields.phone.value.trim() !== '' && !isValidPhone(fields.phone.value.trim())) {
                showError(fields.phone);
                isValid = false;
            }

            if (isValid) {
                // Simuler l'envoi
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '⏳ Envoi en cours...';
                submitBtn.disabled = true;

                // Récupérer les données du formulaire
                const formData = {
                    name: fields.name.value.trim(),
                    email: fields.email.value.trim(),
                    phone: fields.phone ? fields.phone.value.trim() : '',
                    service: fields.service.value,
                    message: fields.message.value.trim()
                };

                console.log('📩 Données du formulaire :', formData);

                setTimeout(function() {
                    alert('✅ Votre message a bien été envoyé !\nNous vous répondrons sous 48h.');
                    contactForm.reset();
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    clearErrors();
                }, 1200);
            } else {
                // Focus sur le premier champ en erreur
                const firstError = document.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    }

    // ================================================================
    // 4. FONCTIONS DE VALIDATION
    // ================================================================

    function validateField(input) {
        if (!input) return true;
        const id = input.id;
        const value = input.value.trim();

        let isValid = true;

        switch (id) {
            case 'name':
                isValid = value.length >= 2;
                break;
            case 'email':
                isValid = isValidEmail(value);
                break;
            case 'service':
                isValid = value !== '';
                break;
            case 'message':
                isValid = value.length >= 10;
                break;
            case 'phone':
                // Optionnel : si rempli, doit être valide
                if (value !== '') {
                    isValid = isValidPhone(value);
                }
                break;
            default:
                return true;
        }

        if (!isValid) {
            showError(input);
        } else {
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error');
            }
        }

        return isValid;
    }

    function showError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
        }
    }

    function clearErrors() {
        document.querySelectorAll('.form-group.error').forEach(function(el) {
            el.classList.remove('error');
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        // Accepte : +226 70 12 34 56, 70 12 34 56, 70123456
        const cleaned = phone.replace(/[\s\-()]/g, '');
        return /^(\+?\d{1,3})?\d{6,14}$/.test(cleaned);
    }

    // ================================================================
    // 5. LIEN ACTIF DANS LA NAVIGATION (ScrollSpy)
    // ================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a:not(.btn-nav)');

    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 150;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Lancer au chargement et au scroll avec debounce
    let scrollTimeout;
    window.addEventListener('load', updateActiveLink);
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateActiveLink);
    });

    // ================================================================
    // 6. ACCESSIBILITÉ - Gestion du focus visible
    // ================================================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // ================================================================
    // 7. ANCRES AVEC SCROLL DOUX
    // ================================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================================================
    // 8. CONSOLE - Message de bienvenue
    // ================================================================
    console.log('%c 🧵 Afrique\'Art ', 'background:#a67b5b;color:#fff;font-size:1.4rem;font-weight:bold;padding:0.5rem 1.5rem;border-radius:8px;');
    console.log('L\'art du pagne traditionnel burkinabè. ✨');
    console.log('📩 Formulaire de contact prêt. N\'hésitez pas à nous écrire !');

})();