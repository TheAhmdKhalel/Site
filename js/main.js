"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    const navLinks = document.querySelectorAll(".nav-link");
    const filterButtons = document.querySelectorAll(".filter-button");
    const projectCards = document.querySelectorAll(".project-card");
    const shareButton = document.getElementById("share-website");
    const siteHeader = document.querySelector(".site-header");
    const languageToggle = document.getElementById("language-toggle");

    // Mobile menu
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "إغلاق القائمة" : "فتح القائمة"
            );
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "فتح القائمة");
            });
        });
    }

    // Portfolio filter
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((item) => {
                item.classList.remove("active");
                item.setAttribute("aria-selected", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-selected", "true");

            projectCards.forEach((project) => {
                const projectCategory = project.dataset.category;
                const shouldShow =
                    selectedFilter === "all" ||
                    selectedFilter === projectCategory;

                project.classList.toggle("is-hidden", !shouldShow);
            });
        });
    });

    // Website sharing
    if (shareButton) {
        shareButton.addEventListener("click", async () => {
            const shareData = {
                title: "Ahmad Khalel",
                text: "Ahmad Khalel — Visual Identity & Web",
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (error) {
                    // The user cancelled the native share dialog.
                }
                return;
            }

            try {
                await navigator.clipboard.writeText(window.location.href);
                const originalHTML = shareButton.innerHTML;
                shareButton.innerHTML = "✓";

                window.setTimeout(() => {
                    shareButton.innerHTML = originalHTML;
                }, 1800);
            } catch (error) {
                window.prompt("انسخ رابط الموقع:", window.location.href);
            }
        });
    }

    // Header visibility on scroll
    if (siteHeader) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeaderVisibility = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 8) {
                siteHeader.classList.remove("header-hidden");
            } else if (currentScrollY > lastScrollY + 4) {
                siteHeader.classList.add("header-hidden");
            } else if (currentScrollY < lastScrollY - 4) {
                siteHeader.classList.remove("header-hidden");
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateHeaderVisibility);
                    ticking = true;
                }
            },
            { passive: true }
        );
    }

    // Language state only — content translation will be implemented separately.
    if (languageToggle) {
        languageToggle.addEventListener("click", () => {
            const isEnglish = document.documentElement.lang === "en";

            if (isEnglish) {
                document.documentElement.lang = "ar";
                document.documentElement.dir = "rtl";
                languageToggle.textContent = "EN";
                languageToggle.setAttribute(
                    "aria-label",
                    "تغيير لغة الموقع إلى الإنجليزية"
                );
                languageToggle.setAttribute("title", "English");
            } else {
                document.documentElement.lang = "en";
                document.documentElement.dir = "ltr";
                languageToggle.textContent = "AR";
                languageToggle.setAttribute(
                    "aria-label",
                    "Switch website language to Arabic"
                );
                languageToggle.setAttribute("title", "العربية");
            }
        });
    }
});

/* =========================================
   REVEAL ANIMATIONS
   ========================================= */

(() => {
    document.documentElement.classList.add('js-enabled');

    const revealElements = document.querySelectorAll(
        '.section-header, .service-card, .work-card, .process-item, .contact-method, .contact-form-wrapper'
    );

    if (!revealElements.length || !('IntersectionObserver' in window)) {
        return;
    }

    revealElements.forEach((element) => element.classList.add('reveal'));

    const observer = new IntersectionObserver((entries, revealObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
})();
