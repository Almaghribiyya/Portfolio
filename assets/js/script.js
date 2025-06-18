document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Hanya jalankan smooth scroll untuk internal links, bukan untuk link kosong seperti href="#"
            if (href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset untuk fixed navbar
                        behavior: 'smooth'
                    });
                    // Tutup mobile menu setelah link diklik
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            }
        });
    });

    // Set current year in footer
    const currentYearEl = document.getElementById('current-year');
    if(currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // IntersectionObserver for animations on scroll
    const animatedElements = document.querySelectorAll('.card-hover, .timeline-item');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
        });
    }

    // Project Modal Logic
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    
    if (modal && modalCloseBtn && viewDetailsBtns.length > 0) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalImage = document.getElementById('modal-image'); 
        const tagsContainer = document.getElementById('modal-tags');
        const modalButtonsContainer = document.getElementById('modal-buttons');

        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Mencegah link '#' menggulir ke atas halaman

                const projectCard = btn.closest('.card-hover');
                const { projectTitle, projectDesc, projectTags, projectUrl, projectImage } = projectCard.dataset;

                modalTitle.textContent = projectTitle;
                modalDesc.textContent = projectDesc;
                
                if (projectImage) {
                    modalImage.src = projectImage;
                    modalImage.alt = `Screenshot ${projectTitle}`;
                    modalImage.style.display = 'block'; 
                } else {
                    modalImage.style.display = 'none'; 
                }

                tagsContainer.innerHTML = '';
                projectTags.split(',').forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'skill-tag'; // Menggunakan kelas skill-tag yang sudah ada
                    tagEl.textContent = tag.trim();
                    tagsContainer.appendChild(tagEl);
                });

                modalButtonsContainer.innerHTML = ''; 

                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-button view-details';
                closeBtn.textContent = 'Close';
                closeBtn.addEventListener('click', closeModal);
                modalButtonsContainer.appendChild(closeBtn);

                if (projectUrl && projectUrl !== '#') {
                    const liveDemoBtn = document.createElement('a');
                    liveDemoBtn.href = projectUrl;
                    liveDemoBtn.target = '_blank';
                    liveDemoBtn.rel = 'noopener noreferrer';
                    liveDemoBtn.className = 'modal-button live-demo';
                    liveDemoBtn.textContent = 'Live Demo';
                    modalButtonsContainer.appendChild(liveDemoBtn);
                }
                
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => {
                    const modalContent = modal.querySelector('.transform');
                    modalContent.classList.remove('scale-95', 'opacity-0');
                    modalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            });
        });

        function closeModal() {
            const modalContent = modal.querySelector('.transform');
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }, 300);
        }

        modalCloseBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // --- LOGIC UNTUK FORM SPREE (INI YANG PENTING) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('contact-form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah form redirect ke halaman Formspree
            const form = e.target;
            const data = new FormData(form);
            
            formStatus.innerHTML = '<p class="text-gray-600">Sending...</p>';
            formStatus.className = 'mt-4 text-center';

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.innerHTML = '<p class="text-green-600 font-medium">Thank you! Your message has been sent successfully.</p>';
                    form.reset(); // Membersihkan semua input field setelah berhasil
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.innerHTML = '<p class="text-red-600 font-medium">Oops! There was a problem submitting your form.</p>';
                        }
                    });
                }
            }).catch(error => {
                formStatus.innerHTML = '<p class="text-red-600 font-medium">Oops! There was a network error.</p>';
            });
        });
    }

    // Combined On Scroll Functions
    const nav = document.querySelector('nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (nav && sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            // Add shadow to navbar
            if (window.scrollY > 10) {
                nav.classList.add('shadow-md');
            } else {
                nav.classList.remove('shadow-md');
            }

            // Highlight active nav link
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 90) { // Offset 90px
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
});