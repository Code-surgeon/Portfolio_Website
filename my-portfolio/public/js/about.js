document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded: Initializing about.js data fetches...");
    fetchAboutProfile();
    fetchSkills();
    fetchExperiences();
    fetchActivities();
});

/**
 * Handle Tab Switching
 */
function switchTab(tabName) {
    // Hide all panels and reset button styles
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-white', 'bg-indigo-600', 'shadow-sm');
        btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-800/60');
    });

    // Show the targeted panel
    const activePanel = document.getElementById(`panel-${tabName}`);
    if (activePanel) {
        activePanel.classList.remove('hidden');
        activePanel.classList.add('flex');
    }

    // Highlight the active tab button
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-800/60');
        activeBtn.classList.add('text-white', 'bg-indigo-600', 'shadow-sm');
    }
}

/**
 * Fetch bio summary for the about page
 */
async function fetchAboutProfile() {
    const container = document.getElementById("about-bio-container");
    if (!container) return;

    try {
        const response = await fetch("/api/profile");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch profile.");
        }

        const profile = result.data;
        container.innerHTML = `
            <p class="text-slate-300 leading-relaxed">${profile.bio_summary || "Full-stack developer and student passionate about building performant, reliable software applications."}</p>
            ${profile.location ? `<p class="text-sm text-indigo-400 mt-2 font-medium">📍 Based in ${profile.location}</p>` : ""}
        `;
    } catch (err) {
        console.error("Client Error [fetchAboutProfile]:", err);
        container.innerHTML = `<p class="text-slate-400">Software developer and student building modern web and mobile applications.</p>`;
    }
}

/**
 * Fetch and group technical skills by category
 */
async function fetchSkills() {
    const container = document.getElementById("skills-container");
    if (!container) return;

    try {
        const response = await fetch("/api/skills");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch skills.");
        }

        const skills = result.data;
        container.innerHTML = "";

        if (skills.length === 0) {
            container.innerHTML = `<p class="text-slate-500 col-span-full text-center">No skills listed yet.</p>`;
            return;
        }

        // Group skills by category
        const grouped = skills.reduce((acc, skill) => {
            const cat = skill.category || "General";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {});

        // Render each category card
        Object.keys(grouped).forEach(category => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between text-left shadow-lg w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md";

            const skillItems = grouped[category].map(s => `
                <div class="flex items-center justify-between py-1.5 border-b border-slate-800/60 last:border-none">
                    <span class="text-slate-200 text-sm font-medium pr-3">${s.skill_name}</span>
                    <span class="text-[10px] uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 shrink-0">${s.status || 'Active'}</span>
                </div>
            `).join("");

            card.innerHTML = `
                <div>
                    <h3 class="text-lg font-bold text-white mb-4 pb-2 border-b border-slate-800 text-center">${category}</h3>
                    <div class="space-y-1">
                        ${skillItems}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Client Error [fetchSkills]:", err);
        container.innerHTML = `<p class="text-red-400 col-span-full text-sm">Unable to load technical skills.</p>`;
    }
}

/**
 * Fetch work experiences and education history
 */
async function fetchExperiences() {
    const container = document.getElementById("experience-container");
    if (!container) return;

    try {
        const response = await fetch("/api/experiences");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch experiences.");
        }

        const items = result.data;
        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm">No experience or education records found.</p>`;
            return;
        }

        items.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full";

            const typeBadge = item.type === 'education'
                ? `<span class="text-[10px] uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-semibold">Education</span>`
                : `<span class="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">Experience</span>`;

            card.innerHTML = `
                <div class="space-y-1 max-w-2xl">
                    <div class="flex items-center space-x-3">
                        <h3 class="text-lg font-bold text-white">${item.title}</h3>
                        ${typeBadge}
                    </div>
                    <p class="text-indigo-400 text-sm font-medium">${item.institution_or_company} ${item.location ? `(${item.location})` : ''}</p>
                    <p class="text-slate-400 text-sm leading-relaxed mt-2">${item.description || ''}</p>
                </div>
                <div class="text-xs font-semibold text-slate-400 md:text-right whitespace-nowrap">
                    ${item.start_date} &mdash; ${item.end_date || 'Present'}
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Client Error [fetchExperiences]:", err);
        container.innerHTML = `<p class="text-red-400 text-sm">Unable to load experience records.</p>`;
    }
}

/**
 * Fetch professional activities and certifications
 */
async function fetchActivities() {
    const container = document.getElementById("activities-container");
    if (!container) return;

    try {
        const response = await fetch("/api/activities");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch activities.");
        }

        const activities = result.data;
        container.innerHTML = "";

        if (activities.length === 0) {
            container.innerHTML = `<p class="text-slate-500 col-span-full text-sm">No professional activities found.</p>`;
            return;
        }

        activities.forEach(act => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between";

            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between gap-2 mb-2">
                        <h3 class="text-lg font-bold text-white">${act.event_name}</h3>
                        <span class="text-xs text-slate-400 font-semibold">${act.date || ''}</span>
                    </div>
                    <p class="text-indigo-400 text-sm font-medium mb-3">${act.organization}</p>
                    <p class="text-slate-400 text-sm leading-relaxed mb-4">${act.description || ''}</p>
                </div>
                <div>
                    ${act.certificate_url ? `<a href="${act.certificate_url}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">View Certificate &rarr;</a>` : ""}
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error("Client Error [fetchActivities]:", err);
        container.innerHTML = `<p class="text-red-400 col-span-full text-sm">Unable to load professional activities.</p>`;
    }
}