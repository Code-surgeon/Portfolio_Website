document.addEventListener("DOMContentLoaded", async() => {
    console.log("DOM loaded: Initializing admin session verification...");
    checkAdminSession();

    // Setup Login Listener
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", handleAdminLogin);
    }

    // Setup Logout Listener
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleAdminLogout);
    }

    // Setup Tab Switching Listeners
    setupDashboardTabs();

    // Setup CRUD form submission listeners
    setupCrudListeners();

    // Setup Profile Image Upload Preview Listener
    setupProfileImageUpload();

    
});

/**
 * Check if the current browser session is authenticated as admin
 */
async function checkAdminSession() {
    try {
        const response = await fetch("/api/admin/status");
        const result = await response.json();

        if (result.success && result.isAuthenticated) {
            console.log("Admin Session Verified: Displaying dashboard.");
            showDashboardView(result.admin);
        } else {
            console.log("Admin Session Status: Unauthenticated.");
            showLoginView();
        }
    } catch (err) {
        console.error("Client Error [checkAdminSession]:", err);
        showLoginView();
    }
}

/**
 * Handle Admin Login Submission
 */
async function handleAdminLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    try {
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Login failed.");
        }

        showAdminFeedback("Login successful!", "success");
        showDashboardView(result.data);
    } catch (err) {
        showAdminFeedback(err.message, "error");
    }
}

/**
 * Handle Admin Logout
 */
async function handleAdminLogout() {
    try {
        const response = await fetch("/api/admin/logout", { method: "POST" });
        const result = await response.json();

        if (result.success) {
            showAdminFeedback("Logged out successfully.", "success");
            showLoginView();
        }
    } catch (err) {
        console.error("Client Error [handleAdminLogout]:", err);
    }
}

/**
 * Toggle UI to Login view
 */
function showLoginView() {
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
    document.getElementById("logout-btn").classList.add("hidden");
}

/**
 * Toggle UI to Dashboard view and load data
 */
function showDashboardView(admin) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    document.getElementById("logout-btn").classList.remove("hidden");

    // Load initial dashboard datasets
    loadMessages();
    loadProfileSettings();
    loadAdminSkills();
    loadAdminExperiences();
    loadAdminActivities();
    loadAdminProjects();
}

/**
 * Tab Navigation Switcher Logic
 */
function setupDashboardTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabs = document.querySelectorAll(".dashboard-tab");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            tabBtns.forEach(b => {
                b.classList.remove("bg-indigo-600", "text-white");
                b.classList.add("bg-slate-900", "text-slate-400");
            });
            btn.classList.remove("bg-slate-900", "text-slate-400");
            btn.classList.add("bg-indigo-600", "text-white");

            tabs.forEach(tab => {
                tab.classList.add("hidden");
                if (tab.id === `tab-${targetTab}`) {
                    tab.classList.remove("hidden");
                }
            });
        });
    });
}

// ==================== DASHBOARD DATA LOADERS & CRUD ====================

async function loadMessages() {
    const container = document.getElementById("messages-list");
    const countBadge = document.getElementById("message-count");
    try {
        const res = await fetch("/api/admin/messages");
        const json = await res.json();
        if (!json.success) return;

        const messages = json.data;
        countBadge.textContent = `${messages.length} message${messages.length === 1 ? '' : 's'}`;
        container.innerHTML = "";

        if (messages.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm">No recruiter messages found.</p>`;
            return;
        }

        messages.forEach(msg => {
            const card = document.createElement("div");
            card.className = `bg-slate-900 border rounded-xl p-6 space-y-3 ${msg.is_read ? 'border-slate-800 opacity-80' : 'border-indigo-500/40'}`;
            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-white">${msg.name} <span class="text-xs text-indigo-400 font-normal">&lt;${msg.email}&gt;</span></h3>
                        <p class="text-xs text-slate-400 font-medium mt-0.5">Subject: ${msg.subject || 'No Subject'}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${!msg.is_read ? `<button onclick="markRead(${msg.id})" class="text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-2.5 py-1 rounded border border-indigo-500/20">Mark Read</button>` : '<span class="text-xs text-emerald-400 font-semibold">Read</span>'}
                        <button onclick="deleteMessage(${msg.id})" class="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded border border-red-500/20">Delete</button>
                    </div>
                </div>
                <p class="text-slate-300 text-sm bg-slate-950 p-4 rounded-lg border border-slate-800/80 leading-relaxed">${msg.message}</p>
                <div class="text-[10px] text-slate-500">${new Date(msg.created_at).toLocaleString()}</div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading messages:", err);
    }
}

async function markRead(id) {
    try {
        await fetch(`/api/admin/messages/${id}/read`, { method: "PATCH" });
        loadMessages();
    } catch (err) { console.error(err); }
}

async function deleteMessage(id) {
    if (!confirm("Delete this message?")) return;
    try {
        await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
        loadMessages();
    } catch (err) { console.error(err); }
}

async function loadProfileSettings() {
    try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (!json.success) return;
        const p = json.data;
        document.getElementById("profile-email").value = p.email || "";
        document.getElementById("profile-location").value = p.location || "";
        document.getElementById("profile-github").value = p.github_url || "";
        document.getElementById("profile-linkedin").value = p.linkedin_url || "";
        document.getElementById("profile-bio").value = p.bio_summary || "";
        document.getElementById("profile-my-name").value = p.my_name || "";
        
        // Populate and display profile picture if available
        const pictureUrl = p.my_picture || "";
        document.getElementById("profile-my-picture").value = pictureUrl;
        const previewImg = document.getElementById("profile-picture-preview");
        const placeholder = document.getElementById("profile-picture-placeholder");
        
        if (pictureUrl) {
            previewImg.src = pictureUrl;
            previewImg.classList.remove("hidden");
            placeholder.classList.add("hidden");
        } else {
            previewImg.src = "";
            previewImg.classList.add("hidden");
            placeholder.classList.remove("hidden");
        }
    } catch (err) { console.error(err); }
}

async function loadAdminSkills() {
    const container = document.getElementById("skills-admin-list");
    try {
        const res = await fetch("/api/skills");
        const json = await res.json();
        if (!json.success) return;
        container.innerHTML = "";
        json.data.forEach(s => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center";
            card.innerHTML = `
                <div>
                    <h4 class="font-bold text-white text-sm">${s.skill_name}</h4>
                    <span class="text-xs text-indigo-400">${s.category}</span>
                </div>
                <button onclick="deleteSkill(${s.id})" class="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20">Delete</button>
            `;
            container.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

async function deleteSkill(id) {
    try {
        await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
        loadAdminSkills();
    } catch (err) { console.error(err); }
}

async function loadAdminExperiences() {
    const container = document.getElementById("experiences-admin-list");
    try {
        const res = await fetch("/api/experiences");
        const json = await res.json();
        if (!json.success) return;
        container.innerHTML = "";
        json.data.forEach(e => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center";
            card.innerHTML = `
                <div>
                    <h4 class="font-bold text-white text-sm">${e.title} <span class="text-xs font-normal text-indigo-400">@ ${e.institution_or_company}</span></h4>
                    <p class="text-xs text-slate-400">${e.start_date} - ${e.end_date || 'Present'}</p>
                </div>
                <button onclick="deleteExperience(${e.id})" class="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20">Delete</button>
            `;
            container.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

async function deleteExperience(id) {
    try {
        await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
        loadAdminExperiences();
    } catch (err) { console.error(err); }
}

async function loadAdminActivities() {
    const container = document.getElementById("activities-admin-list");
    try {
        const res = await fetch("/api/activities");
        const json = await res.json();
        if (!json.success) return;
        container.innerHTML = "";
        json.data.forEach(a => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center";
            card.innerHTML = `
                <div>
                    <h4 class="font-bold text-white text-sm">${a.event_name}</h4>
                    <p class="text-xs text-indigo-400">${a.organization}</p>
                </div>
                <button onclick="deleteActivity(${a.id})" class="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20">Delete</button>
            `;
            container.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

async function deleteActivity(id) {
    try {
        await fetch(`/api/admin/activities/${id}`, { method: "DELETE" });
        loadAdminActivities();
    } catch (err) { console.error(err); }
}

/**
 * Setup CRUD Submission Event Listeners
 */
function setupCrudListeners() {
    // Profile Update Form
    // Profile Update Form
    document.getElementById("profile-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("email", document.getElementById("profile-email").value);
        formData.append("location", document.getElementById("profile-location").value);
        formData.append("github_url", document.getElementById("profile-github").value);
        formData.append("linkedin_url", document.getElementById("profile-linkedin").value);
        formData.append("bio_summary", document.getElementById("profile-bio").value);
        formData.append("my_name", document.getElementById("profile-my-name").value);
        // formData.append("my_picture", document.getElementById("profile-my-picture").value);

        // Append actual file if one was chosen in the file input
        const fileInput = document.getElementById("profile-image-file");
        if (fileInput.files[0]) {
            formData.append("profile_image", fileInput.files[0]);
        }
        
        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                // Note: Do NOT set "Content-Type": "application/json" header when sending FormData; 
                // the browser automatically sets multipart/form-data boundary headers.
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                showAdminFeedback("Profile updated successfully!", "success");
                // Reload profile settings to reflect the saved server image URL
                loadProfileSettings();
            } else {
                throw new Error(json.error);
            }
        } catch (err) { showAdminFeedback(err.message, "error"); }
    });

    // Skill Form
    document.getElementById("skill-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            category: document.getElementById("skill-category").value,
            skill_name: document.getElementById("skill-name").value,
            status: document.getElementById("skill-status").value || "actively using"
        };
        try {
            await fetch("/api/admin/skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            document.getElementById("skill-form").reset();
            loadAdminSkills();
        } catch (err) { console.error(err); }
    });

    // Experience Form
    document.getElementById("experience-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            type: document.getElementById("exp-type").value,
            title: document.getElementById("exp-title").value,
            institution_or_company: document.getElementById("exp-institution").value,
            start_date: document.getElementById("exp-start").value,
            end_date: document.getElementById("exp-end").value,
            location: document.getElementById("exp-location").value,
            description: document.getElementById("exp-desc").value
        };
        try {
            await fetch("/api/admin/experiences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            document.getElementById("experience-form").reset();
            loadAdminExperiences();
        } catch (err) { console.error(err); }
    });

    // Activity Form
    document.getElementById("activity-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            event_name: document.getElementById("act-name").value,
            organization: document.getElementById("act-org").value,
            date: document.getElementById("act-date").value,
            certificate_url: document.getElementById("act-url").value,
            description: document.getElementById("act-desc").value
        };
        try {
            await fetch("/api/admin/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            document.getElementById("activity-form").reset();
            loadAdminActivities();
        } catch (err) { console.error(err); }
    });

    // Project Form
    const projectForm = document.getElementById("project-form");
    if (projectForm) {
        projectForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const payload = {
                title: document.getElementById("proj-title").value,
                video_url: document.getElementById("proj-youtube").value,       // Matches DB column
                tech_stack: document.getElementById("proj-tech").value,
                live_url: document.getElementById("proj-link").value,         // Matches DB column
                short_description: document.getElementById("proj-desc").value // Matches DB column
            };
            try {
                const res = await fetch("/api/admin/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const json = await res.json();
                if (json.success) {
                    projectForm.reset();
                    loadAdminProjects();
                    showAdminFeedback("Project added successfully!", "success");
                } else {
                    throw new Error(json.error || "Failed to add project");
                }
            } catch (err) { showAdminFeedback(err.message, "error"); }
        });
    }
}

function showAdminFeedback(message, type) {
    const box = document.getElementById("admin-feedback");
    box.textContent = message;
    box.classList.remove("hidden", "bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20", "bg-red-500/10", "text-red-400", "border-red-500/20");
    if (type === "success") {
        box.classList.add("bg-emerald-500/10", "text-emerald-400", "border", "border-emerald-500/20");
    } else {
        box.classList.add("bg-red-500/10", "text-red-400", "border", "border-red-500/20");
    }
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


// PROJECTS
async function loadAdminProjects() {
    const container = document.getElementById("projects-admin-list");
    if (!container) return;
    try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (!json.success) return;
        container.innerHTML = "";
        
        if (json.data.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm col-span-2">No projects found.</p>`;
            return;
        }

        json.data.forEach(p => {
            const embedUrl = getYouTubeEmbedUrl(p.video_url);
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4";
            card.innerHTML = `
                <div class="space-y-3">
                    <h4 class="font-bold text-white text-sm">${p.title}</h4>
                    
                    <!-- Embedded Video Player -->
                    ${embedUrl ? `
                        <div class="aspect-video w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                            <iframe src="${embedUrl}" class="w-full h-full" title="${p.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    ` : '<div class="text-xs text-slate-500 italic">No video provided</div>'}

                    <p class="text-xs text-slate-400 line-clamp-2">${p.short_description || 'No description provided.'}</p>
                </div>
                
                <div class="flex justify-between items-center pt-3 border-t border-slate-800">
                    <span class="text-[10px] text-indigo-400 font-medium">${p.tech_stack || ''}</span>
                    <button onclick="deleteProject(${p.id})" class="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20">Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) { console.error(err); }
}

function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    // Extracts the video ID from standard, short, or already-embedded YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
}



async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;
    try {
        await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
        loadAdminProjects();
    } catch (err) { console.error(err); }
}



/**
 * Setup Profile Picture File Chooser & Preview Logic
 */
function setupProfileImageUpload() {
    const uploadBtn = document.getElementById("upload-image-btn");
    const fileInput = document.getElementById("profile-image-file");
    const hiddenUrlInput = document.getElementById("profile-my-picture");
    const previewImg = document.getElementById("profile-picture-preview");
    const placeholder = document.getElementById("profile-picture-placeholder");

    if (!uploadBtn || !fileInput) return;

    // Trigger hidden file input click when custom button is clicked
    uploadBtn.addEventListener("click", () => {
        fileInput.click();
    });

    // Handle file selection and local preview (or base64/object URL assignment)
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Optional size check (e.g. 5MB limit)
        if (file.size > 15 * 1024 * 1024) {
            showAdminFeedback("Image file is too large (Max 15MB).", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const base64String = e.target.result;
            // Set preview image source
            previewImg.src = base64String;
            previewImg.classList.remove("hidden");
            placeholder.classList.add("hidden");

            // Assign base64 or path to the hidden input so it gets saved on form submit
            hiddenUrlInput.value = base64String;
        };
        reader.readAsDataURL(file);
    });
}

