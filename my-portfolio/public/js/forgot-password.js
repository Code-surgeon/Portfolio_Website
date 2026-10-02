document.addEventListener("DOMContentLoaded", () => {
    const recoveryForm = document.getElementById("recovery-form");

    if (recoveryForm) {
        recoveryForm.addEventListener("submit", handlePasswordRecovery);
    }
});

/**
 * Handle password recovery submission via Fetch API POST request
 */
async function handlePasswordRecovery(event) {
    event.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    const email = document.getElementById("email").value.trim();

    if (!email) {
        showFeedback("Please enter your email address.", "error");
        return;
    }

    // Disable button & show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending request...";

    try {
        const response = await fetch("/api/admin/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to process recovery request.");
        }

        showFeedback("Temporary password sent! Check your inbox, then use it to log in and update your password.", "success");
        document.getElementById("recovery-form").reset();

    } catch (err) {
        console.error("Client Error [handlePasswordRecovery]:", err);
        showFeedback(err.message || "An error occurred. Please try again.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Temporary Password";
    }
}

/**
 * Helper function to display feedback states
 */
function showFeedback(message, type) {
    const feedbackBox = document.getElementById("recovery-feedback");
    if (!feedbackBox) return;

    feedbackBox.textContent = message;
    feedbackBox.classList.remove("hidden", "bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20", "bg-red-500/10", "text-red-400", "border-red-500/20");

    if (type === "success") {
        feedbackBox.classList.add("bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20");
    } else {
        feedbackBox.classList.add("bg-red-500/10", "text-red-400", "border", "border-red-500/20");
    }

    feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}