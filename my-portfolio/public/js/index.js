document.addEventListener("DOMContentLoaded", async() => {
    console.log("DOM loaded: Initializing index.js data fetch...");
    fetchProfileData();
    fetchFeaturedProjectsData();
    await loadHomeProfile()
});

/**
 * Fetch profile information (bio, tagline, social links) from the backend
 */
async function fetchProfileData() {
    try {
        console.log("Client Fetch: Requesting /api/profile...");
        const response = await fetch("/api/profile");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch profile information.");
        }

        const profile = result.data;
        console.log("Client Success: Profile data retrieved.", profile);

        // Update Hero Section Bio if element exists
        const bioElement = document.getElementById("hero-bio");
        if (bioElement && profile.bio_summary) {
            bioElement.textContent = profile.bio_summary;
        }

        // Render Social Links in Footer if available
        const socialContainer = document.getElementById("social-links");
        if (socialContainer) {
            socialContainer.innerHTML = ""; // Clear loader/placeholder

            if (profile.github_url) {
                const ghLink = document.createElement("a");
                ghLink.href = profile.github_url;
                ghLink.target = "_blank";
                ghLink.rel = "noopener noreferrer";
                ghLink.className = "hover:text-indigo-400 transition-colors";
                ghLink.textContent = "GitHub";
                socialContainer.appendChild(ghLink);
            }

            if (profile.linkedin_url) {
                const liLink = document.createElement("a");
                liLink.href = profile.linkedin_url;
                liLink.target = "_blank";
                liLink.rel = "noopener noreferrer";
                liLink.className = "hover:text-indigo-400 transition-colors";
                liLink.textContent = "LinkedIn";
                socialContainer.appendChild(liLink);
            }

            if (profile.email) {
                const emailLink = document.createElement("a");
                emailLink.href = `mailto:${profile.email}`;
                emailLink.className = "hover:text-indigo-400 transition-colors";
                emailLink.textContent = "Email";
                socialContainer.appendChild(emailLink);
            }
        }

    } catch (err) {
        console.error("Client Error [fetchProfileData]:", err);
        const bioElement = document.getElementById("hero-bio");
        if (bioElement) {
            bioElement.textContent = "Welcome to my portfolio! Explore my projects and background below.";
        }
    }
}

/**
 * Fetch featured projects for the homepage grid from the backend
 */
async function fetchFeaturedProjectsData() {
    const gridContainer = document.getElementById("featured-projects-grid");
    if (!gridContainer) return;

    try {
        console.log("Client Fetch: Requesting /api/projects/featured...");
        const response = await fetch("/api/projects/featured");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch featured projects.");
        }

        const projects = result.data;
        console.log(`Client Success: Retrieved ${projects.length} featured projects.`);

        gridContainer.innerHTML = ""; // Clear loading pulses

        if (projects.length === 0) {
            gridContainer.innerHTML = `
                <p class="text-slate-500 col-span-3 text-sm">No featured projects found yet. Check back soon!</p>
            `;
            return;
        }

        // Render each featured project card
        projects.forEach(project => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all";

            // Format tech stack array or string
            let techBadges = "";
            if (project.technologies_used) {
                const techs = Array.isArray(project.technologies_used) 
                    ? project.technologies_used 
                    : project.technologies_used.split(",").map(t => t.trim());
                
                techBadges = techs.map(tech => `
                    <span class="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                        ${tech}
                    </span>
                `).join("");
            }

            card.innerHTML = `
                <div>
                    <h3 class="text-lg font-bold text-white mb-2">${project.title}</h3>
                    <p class="text-slate-400 text-sm mb-4 line-clamp-3">${project.description}</p>
                </div>
                <div>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${techBadges}
                    </div>
                    <div class="flex items-center space-x-4 text-xs font-semibold">
                        ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300">GitHub &rarr;</a>` : ""}
                        ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300">Live Demo &rarr;</a>` : ""}
                    </div>
                </div>
            `;

            gridContainer.appendChild(card);
        });

    } catch (err) {
        console.error("Client Error [fetchFeaturedProjectsData]:", err);
        gridContainer.innerHTML = `
            <p class="text-red-400 col-span-3 text-sm">Unable to load featured projects at the moment.</p>
        `;
    }
}

// Example snippet to add to your index page script loader
async function loadHomeProfile() {
    try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (!json.success || !json.data) return;
        
        const p = json.data;
        const container = document.getElementById("hero-profile-container");
        const imgElement = document.getElementById("hero-my-picture");
        const nameElement = document.getElementById("hero-my-name");

        if (p.my_picture || p.my_name) {
            if (p.my_picture) {
                imgElement.src = p.my_picture;
            } else {
                imgElement.src = ""; // Fallback or handle placeholder
            }
            
            if (p.my_name) {
                nameElement.textContent = p.my_name;
            }

            // Reveal the container once data is loaded
            container.classList.remove("hidden");
        }
    } catch (err) {
        console.error("Failed to load profile details on homepage:", err);
    }
}