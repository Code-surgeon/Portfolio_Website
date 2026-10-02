document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded: Initializing contact.js form listener...");
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", handleContactSubmission);
    }
});

/**
 * Handle contact form submission via Fetch API POST request
 */
async function handleContactSubmission(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById("submit-btn");
    const feedbackBox = document.getElementById("form-feedback");
    
    // Extract form input values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Client-side validation check
    if (!name || !email || !message) {
        showFeedback("Please fill out all required fields.", "error");
        return;
    }

    // Disable button & show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending message...";

    try {
        console.log("Client Submit: Sending contact payload to /api/contact...");
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, subject, message })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to submit message.");
        }

        console.log("Client Success: Message saved successfully.");
        showFeedback("Thank you! Your message has been sent successfully. I'll get back to you soon.", "success");
        
        // Reset form inputs
        document.getElementById("contact-form").reset();

    } catch (err) {
        console.error("Client Error [handleContactSubmission]:", err);
        showFeedback(err.message || "An error occurred while sending your message. Please try again.", "error");
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
    }
}

/**
 * Helper function to display form feedback states (success or error)
 */
function showFeedback(message, type) {
    const feedbackBox = document.getElementById("form-feedback");
    if (!feedbackBox) return;

    feedbackBox.textContent = message;
    feedbackBox.classList.remove("hidden", "bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20", "bg-red-500/10", "text-red-400", "border-red-500/20");

    if (type === "success") {
        feedbackBox.classList.add("bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20");
    } else {
        feedbackBox.classList.add("bg-red-500/10", "text-red-400", "border", "border-red-500/20");
    }

    // Scroll smoothly to feedback box
    feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}