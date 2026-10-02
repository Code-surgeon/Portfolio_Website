document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded: Initializing projects.js data fetch...");
    fetchAllProjects();
});

/**
 * Helper to convert standard YouTube links into embeddable URLs
 */
function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
}

/**
 * Fetch all projects from the backend API and render them to the grid
 */
async function fetchAllProjects() {
    const gridContainer = document.getElementById("all-projects-grid");
    const countIndicator = document.getElementById("project-count-indicator");
    
    if (!gridContainer) return;

    try {
        console.log("Client Fetch: Requesting /api/projects...");
        const response = await fetch("/api/projects");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || "Failed to fetch projects catalog.");
        }

        const projects = result.data;
        console.log(`Client Success: Retrieved ${projects.length} projects.`);

        gridContainer.innerHTML = ""; // Clear loading skeletons

        if (countIndicator) {
            countIndicator.textContent = `Showing ${projects.length} project${projects.length === 1 ? '' : 's'}`;
        }

        if (projects.length === 0) {
            gridContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-slate-500 text-sm">No projects found in the catalog yet.</p>
                </div>
            `;
            return;
        }

        // Render each project card
        projects.forEach(project => {
            const card = document.createElement("div");
            card.className = "bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4";

            // Format tech stack array or comma-separated string (mapped to database column `tech_stack`)
            let techBadges = "";
            const techSource = project.tech_stack || project.technologies_used;
            if (techSource) {
                const techs = Array.isArray(techSource) 
                    ? techSource 
                    : techSource.split(",").map(t => t.trim());
                
                techBadges = techs.map(tech => `
                    <span class="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
                        ${tech}
                    </span>
                `).join("");
            }

            // Featured badge check
            const featuredBadge = project.is_featured 
                ? `<span class="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">Featured</span>` 
                : '';

            // YouTube video embed (mapped to database column `video_url`)
            const embedUrl = getYouTubeEmbedUrl(project.video_url);

            // Description text (mapped to database column `short_description`)
            const descriptionText = project.short_description || project.description || 'No description provided.';

            card.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="text-lg font-bold text-white">${project.title}</h3>
                        ${featuredBadge}
                    </div>

                    <!-- Embedded YouTube Video Player -->
                    ${embedUrl ? `
                        <div class="aspect-video w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                            <iframe src="${embedUrl}" class="w-full h-full" title="${project.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    ` : ''}

                    <p class="text-slate-400 text-sm leading-relaxed">${descriptionText}</p>
                </div>

                <div>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${techBadges}
                    </div>
                    <div class="flex items-center space-x-4 text-s font-semibold pt-4 border-t border-slate-800/80">
                        ${project.github_url ? `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 transition-colors">GitHub Repository &rarr;</a>` : ""}
                        ${project.live_url ? `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 transition-colors">Github link &rarr;</a>` : ""}
                    </div>
                </div>
            `;

            gridContainer.appendChild(card);
        });

    } catch (err) {
        console.error("Client Error [fetchAllProjects]:", err);
        gridContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-red-400 text-sm">Unable to load projects catalog at the moment. Please try again later.</p>
            </div>
        `;
        if (countIndicator) {
            countIndicator.textContent = "Error loading projects";
        }
    }
}