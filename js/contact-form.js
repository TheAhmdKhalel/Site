"use strict";

/*
 * Contact Form — Web3Forms
 *
 * The form posts directly to Web3Forms, so no custom backend is required.
 * Replace YOUR_WEB3FORMS_ACCESS_KEY in index.html with the Access Key from
 * your Web3Forms account before publishing.
 */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");

    if (!form) return;

    const submitButton = form.querySelector(".form-submit-button");
    const status = document.getElementById("form-status");
    const originalHTML = submitButton ? submitButton.innerHTML : "";
    const endpoint = "https://api.web3forms.com/submit";

    const setStatus = (message, type = "") => {
        if (!status) return;

        status.hidden = false;
        status.textContent = message;
        status.dataset.status = type;
    };

    const clearStatus = () => {
        if (!status) return;

        status.hidden = true;
        status.textContent = "";
        status.removeAttribute("data-status");
    };

    const setButton = (html, disabled) => {
        if (!submitButton) return;

        submitButton.disabled = disabled;
        submitButton.innerHTML = html;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearStatus();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const accessKey = form.elements.access_key?.value?.trim();

        if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
            setStatus(
                "لم يتم تفعيل استقبال الرسائل بعد. أضف Access Key الخاص بـ Web3Forms.",
                "error"
            );
            return;
        }

        const formData = new FormData(form);

        // Convert internal select values into readable Arabic labels.
        const service = form.elements.service;
        const budget = form.elements.budget;

        if (service) {
            formData.set("service", service.options[service.selectedIndex]?.text || "");
        }

        if (budget) {
            formData.set("budget", budget.options[budget.selectedIndex]?.text || "غير محددة حاليًا");
        }

        try {
            setButton("جاري الإرسال... <span aria-hidden=\"true\">↗</span>", true);

            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.success !== true) {
                throw new Error(result.message || `Request failed: ${response.status}`);
            }

            form.reset();
            setStatus(
                "تم إرسال طلبك بنجاح. شكرًا لك، وسأتواصل معك قريبًا.",
                "success"
            );
            setButton("تم الإرسال <span aria-hidden=\"true\">✓</span>", false);

            window.setTimeout(() => {
                setButton(originalHTML, false);
            }, 4000);
        } catch (error) {
            console.error("Contact form submission failed:", error);

            setStatus(
                "تعذر إرسال الطلب حاليًا. حاول مرة أخرى أو تواصل معي عبر البريد الإلكتروني.",
                "error"
            );
            setButton(originalHTML, false);
        }
    });
});
