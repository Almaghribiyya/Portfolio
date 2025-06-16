document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if(menuBtn) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
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
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectCard = btn.closest('.card-hover');
                const title = projectCard.dataset.projectTitle;
                const desc = projectCard.dataset.projectDesc;
                const tags = projectCard.dataset.projectTags.split(',');

                document.getElementById('modal-title').textContent = title;
                document.getElementById('modal-desc').textContent = desc;
                
                const tagsContainer = document.getElementById('modal-tags');
                tagsContainer.innerHTML = '';
                tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded';
                    tagEl.textContent = tag;
                    tagsContainer.appendChild(tagEl);
                });
                
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => modal.classList.add('visible'), 10);
            });
        });

        function closeModal() {
            modal.classList.remove('visible');
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

    // Combined On Scroll Functions
    const nav = document.querySelector('nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        // Add shadow to navbar
        if (nav && window.scrollY > 10) {
            nav.classList.add('shadow-md');
        } else if (nav) {
            nav.classList.remove('shadow-md');
        }

        // Highlight active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
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
});