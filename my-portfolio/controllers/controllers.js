import { getAllProjects, getFeaturedProjects, getAllSkills, getAllExperiences, getAllActivities, createContactMessage,
    createSkill, deleteSkill, createExperience, deleteExperience, createActivity, deleteActivity, getAllMessages, markMessageAsRead, 
    deleteMessage, updateSkill, updateExperience, updateActivity,createProject,deleteProjectRecord,updateAdminProfile
 } from "../config/db.js"


// PART 1 - Public-Facing Features
// -------------------------------------------------------------------------------------------------------------------------------
/**
 * Controller to fetch all projects for the main projects view.
 */
export async function fetchAllProjectsController(req, res, next) {
    console.log("Controller Request Received: Fetching all projects.");
    try {
        const projects = await getAllProjects();
        console.log(`Controller Success: Returning ${projects.length} projects to client.`);
        return res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        console.error("Controller Error [fetchAllProjectsController]: Failed to fetch projects.", {
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
}

/**
 * Controller to fetch featured projects for the homepage dashboard.
 */
export async function fetchFeaturedProjectsController(req, res, next) {
    console.log("Controller Request Received: Fetching featured projects for homepage.");
    try {
        const featuredProjects = await getFeaturedProjects();
        console.log(`Controller Success: Returning ${featuredProjects.length} featured projects.`);
        return res.status(200).json({
            success: true,
            count: featuredProjects.length,
            data: featuredProjects
        });
    } catch (err) {
        console.error("Controller Error [fetchFeaturedProjectsController]: Failed to fetch featured projects.", {
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
}
 

/**
 * Controller to fetch all technical skills grouped by category.
 */
export async function fetchSkillsController(req, res, next) {
    console.log("Controller Request Received: Fetching all technical skills.");
    try {
        const skills = await getAllSkills();
        console.log(`Controller Success: Returning ${skills.length} skills to client.`);
        return res.status(200).json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (err) {
        console.error("Controller Error [fetchSkillsController]: Failed to fetch skills.", {
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
}



/**
 * Controller to fetch all education and experience records.
 */
export async function fetchExperiencesController(req, res, next) {
    console.log("Controller Request Received: Fetching experience and education history.");
    try {
        const experiences = await getAllExperiences();
        console.log(`Controller Success: Returning ${experiences.length} experience records.`);
        return res.status(200).json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (err) {
        console.error("Controller Error [fetchExperiencesController]: Failed to fetch experiences.", {
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
}


/**
 * Controller to fetch all professional activities and achievements.
 */
export async function fetchActivitiesController(req, res, next) {
    console.log("Controller Request Received: Fetching professional activities.");
    try {
        const activities = await getAllActivities();
        console.log(`Controller Success: Returning ${activities.length} professional activities.`);
        return res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (err) {
        console.error("Controller Error [fetchActivitiesController]: Failed to fetch activities.", {
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
}



/**
 * Controller to handle submission of the public contact form.
 */
export async function submitContactController(req, res, next) {
    console.log("Controller Request Received: Processing contact form submission.");
    const { sender_name, sender_email, message_body } = req.body;

    // Basic validation check
    if (!sender_name || !sender_email || !message_body) {
        console.warn("Controller Warning: Contact form submission missing required fields.");
        return res.status(400).json({
            success: false,
            error: "All fields (sender_name, sender_email, message_body) are required."
        });
    }

    try {
        const newMessage = await createContactMessage(sender_name, sender_email, message_body);
        console.log("Controller Success: Contact message saved and confirmation prepared.");
        return res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!",
            data: newMessage
        });
    } catch (err) {
        console.error("Controller Error [submitContactController]: Failed to save contact message.", {
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------





// PART3 - Admin Dashboard CRUD Features
// -------------------------------------------------------------------------------------------------------------------------------


// SKILLS
// ---------------------------------------------------------------------------------------------
/**
 * Controller to add a new technical skill.
 */
export async function createSkillController(req, res, next) {
    console.log("Controller Request Received: Adding a new technical skill.");
    const { category, skill_name, status, display_order } = req.body;

    if (!category || !skill_name) {
        console.warn("Controller Warning: Missing required fields (category or skill_name).");
        return res.status(400).json({ success: false, error: "Category and skill name are required." });
    }

    try {
        const newSkill = await createSkill(category, skill_name, status, display_order);
        console.log(`Controller Success: Skill '${skill_name}' created successfully.`);
        return res.status(201).json({ success: true, message: "Skill added successfully.", data: newSkill });
    } catch (err) {
        console.error("Controller Error [createSkillController]: Failed to create skill.", { message: err.message, stack: err.stack });
        next(err);
    }
}

/**
 * Controller to delete a technical skill by ID.
 */
export async function deleteSkillController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Deleting skill ID: ${id}`);

    try {
        const deleted = await deleteSkill(id);
        if (!deleted) {
            console.warn(`Controller Warning: Skill ID ${id} not found for deletion.`);
            return res.status(404).json({ success: false, error: "Skill not found." });
        }
        console.log(`Controller Success: Skill ID ${id} deleted.`);
        return res.status(200).json({ success: true, message: "Skill deleted successfully." });
    } catch (err) {
        console.error("Controller Error [deleteSkillController]: Failed to delete skill.", { message: err.message, stack: err.stack });
        next(err);
    }
}

export async function updateSkillController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Updating skill ID ${id}`);
    const { category, skill_name, status, display_order } = req.body;

    if (!category || !skill_name) {
        console.warn("Controller Warning: Missing required fields for skill update.");
        return res.status(400).json({ success: false, error: "Category and skill name are required." });
    }

    try {
        const updated = await updateSkill(id, category, skill_name, status, display_order);
        if (!updated) {
            console.warn(`Controller Warning: Skill ID ${id} not found.`);
            return res.status(404).json({ success: false, error: "Skill not found." });
        }
        console.log(`Controller Success: Skill ID ${id} updated.`);
        return res.status(200).json({ success: true, message: "Skill updated successfully.", data: updated });
    } catch (err) {
        console.error("Controller Error [updateSkillController]: Failed to update skill.", { message: err.message });
        next(err);
    }
}
// ---------------------------------------------------------------------------------------------


// EXPERIENCE
// ---------------------------------------------------------------------------------------------
/**
 * Controller to add a new experience or education record.
 */
export async function createExperienceController(req, res, next) {
    console.log("Controller Request Received: Adding new experience/education record.");
    const { type, title, institution_or_company, location, start_date, end_date, description, display_order } = req.body;

    if (!type || !title || !institution_or_company || !start_date || !end_date) {
        console.warn("Controller Warning: Missing required experience fields.");
        return res.status(400).json({ success: false, error: "Type, title, institution/company, start date, and end date are required." });
    }

    try {
        const record = await createExperience(type, title, institution_or_company, location, start_date, end_date, description, display_order);
        console.log(`Controller Success: Experience record created with ID: ${record.id}`);
        return res.status(201).json({ success: true, message: "Experience record added successfully.", data: record });
    } catch (err) {
        console.error("Controller Error [createExperienceController]: Failed to create experience record.", { message: err.message, stack: err.stack });
        next(err);
    }
}

/**
 * Controller to delete an experience record by ID.
 */
export async function deleteExperienceController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Deleting experience ID: ${id}`);

    try {
        const deleted = await deleteExperience(id);
        if (!deleted) {
            console.warn(`Controller Warning: Experience ID ${id} not found for deletion.`);
            return res.status(404).json({ success: false, error: "Experience record not found." });
        }
        console.log(`Controller Success: Experience record ID ${id} deleted.`);
        return res.status(200).json({ success: true, message: "Experience record deleted successfully." });
    } catch (err) {
        console.error("Controller Error [deleteExperienceController]: Failed to delete experience record.", { message: err.message, stack: err.stack });
        next(err);
    }
}


export async function updateExperienceController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Updating experience ID ${id}`);
    const { type, title, institution_or_company, location, start_date, end_date, description, display_order } = req.body;

    if (!type || !title || !institution_or_company || !start_date || !end_date) {
        console.warn("Controller Warning: Missing required fields for experience update.");
        return res.status(400).json({ success: false, error: "Type, title, institution/company, start date, and end date are required." });
    }

    try {
        const updated = await updateExperience(id, type, title, institution_or_company, location, start_date, end_date, description, display_order);
        if (!updated) {
            console.warn(`Controller Warning: Experience ID ${id} not found.`);
            return res.status(404).json({ success: false, error: "Experience record not found." });
        }
        console.log(`Controller Success: Experience ID ${id} updated.`);
        return res.status(200).json({ success: true, message: "Experience record updated successfully.", data: updated });
    } catch (err) {
        console.error("Controller Error [updateExperienceController]: Failed to update experience.", { message: err.message });
        next(err);
    }
}
// ---------------------------------------------------------------------------------------------


// ACTIVITY
// ---------------------------------------------------------------------------------------------
/**
 * Controller to add a new professional activity or certification.
 */
export async function createActivityController(req, res, next) {
    console.log("Controller Request Received: Adding new professional activity.");
    const { event_name, organization, date, description, certificate_url, display_order } = req.body;

    if (!event_name || !organization) {
        console.warn("Controller Warning: Missing required activity fields (event_name or organization).");
        return res.status(400).json({ success: false, error: "Event name and organization are required." });
    }

    try {
        const activity = await createActivity(event_name, organization, date, description, certificate_url, display_order);
        console.log(`Controller Success: Professional activity created with ID: ${activity.id}`);
        return res.status(201).json({ success: true, message: "Professional activity added successfully.", data: activity });
    } catch (err) {
        console.error("Controller Error [createActivityController]: Failed to create activity.", { message: err.message, stack: err.stack });
        next(err);
    }
}

/**
 * Controller to delete a professional activity by ID.
 */
export async function deleteActivityController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Deleting professional activity ID: ${id}`);

    try {
        const deleted = await deleteActivity(id);
        if (!deleted) {
            console.warn(`Controller Warning: Professional activity ID ${id} not found for deletion.`);
            return res.status(404).json({ success: false, error: "Professional activity not found." });
        }
        console.log(`Controller Success: Professional activity ID ${id} deleted.`);
        return res.status(200).json({ success: true, message: "Professional activity deleted successfully." });
    } catch (err) {
        console.error("Controller Error [deleteActivityController]: Failed to delete activity.", { message: err.message, stack: err.stack });
        next(err);
    }
}


export async function updateActivityController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Updating professional activity ID ${id}`);
    const { event_name, organization, date, description, certificate_url, display_order } = req.body;

    if (!event_name || !organization) {
        console.warn("Controller Warning: Missing required fields for activity update.");
        return res.status(400).json({ success: false, error: "Event name and organization are required." });
    }

    try {
        const updated = await updateActivity(id, event_name, organization, date, description, certificate_url, display_order);
        if (!updated) {
            console.warn(`Controller Warning: Professional activity ID ${id} not found.`);
            return res.status(404).json({ success: false, error: "Professional activity not found." });
        }
        console.log(`Controller Success: Professional activity ID ${id} updated.`);
        return res.status(200).json({ success: true, message: "Professional activity updated successfully.", data: updated });
    } catch (err) {
        console.error("Controller Error [updateActivityController]: Failed to update activity.", { message: err.message });
        next(err);
    }
}
// ---------------------------------------------------------------------------------------------


// MESSAGE
// ---------------------------------------------------------------------------------------------
/**
 * Controller to fetch all contact messages for the admin dashboard.
 */
export async function fetchAllMessagesController(req, res, next) {
    console.log("Controller Request Received: Admin fetching all contact messages.");
    try {
        const messages = await getAllMessages();
        console.log(`Controller Success: Returning ${messages.length} messages to admin.`);
        return res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) {
        console.error("Controller Error [fetchAllMessagesController]: Failed to fetch messages.", { message: err.message, stack: err.stack });
        next(err);
    }
}

/**
 * Controller to mark a contact message as read.
 */
export async function markMessageReadController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Marking message ID ${id} as read.`);

    try {
        const updated = await markMessageAsRead(id);
        if (!updated) {
            console.warn(`Controller Warning: Message ID ${id} not found.`);
            return res.status(404).json({ success: false, error: "Message not found." });
        }
        console.log(`Controller Success: Message ID ${id} marked as read.`);
        return res.status(200).json({ success: true, message: "Message marked as read.", data: updated });
    } catch (err) {
        console.error("Controller Error [markMessageReadController]: Failed to update message status.", { message: err.message, stack: err.stack });
        next(err);
    }
}

/**
 * Controller to delete a contact message by ID.
 */
export async function deleteMessageController(req, res, next) {
    const { id } = req.params;
    console.log(`Controller Request Received: Deleting message ID ${id}`);

    try {
        const deleted = await deleteMessage(id);
        if (!deleted) {
            console.warn(`Controller Warning: Message ID ${id} not found for deletion.`);
            return res.status(404).json({ success: false, error: "Message not found." });
        }
        console.log(`Controller Success: Message ID ${id} deleted.`);
        return res.status(200).json({ success: true, message: "Message deleted successfully." });
    } catch (err) {
        console.error("Controller Error [deleteMessageController]: Failed to delete message.", { message: err.message, stack: err.stack });
        next(err);
    }
}
// ---------------------------------------------------------------------------------------------

// PROJECTS
// ---------------------------------------------------------------------------------------------
export async function createProjectController(req, res) {
    try {
        const { 
            title, 
            video_url,         // Check this matches what the frontend sends
            youtube_url,       // Fallback in case frontend sends youtube_url
            tech_stack, 
            live_url, 
            project_url,       // Fallback in case frontend sends project_url
            short_description, 
            description        // Fallback in case frontend sends description
        } = req.body;
        
        // Resolve fallbacks
        const finalVideoUrl = video_url || youtube_url;
        const finalLiveUrl = live_url || project_url;
        const finalDescription = short_description || description;

        if (!title || !finalVideoUrl) {
            return res.status(400).json({ success: false, error: "Title and YouTube URL are required." });
        }

        const newProject = await createProject({ 
            title, 
            video_url: finalVideoUrl, 
            tech_stack, 
            live_url: finalLiveUrl, 
            short_description: finalDescription 
        });

        res.json({ success: true, data: newProject });
    } catch (err) {
        console.error("Error in createProjectController:", err);
        res.status(500).json({ success: false, error: "Failed to create project." });
    }
}

export async function deleteProjectController(req, res) {
    try {
        const { id } = req.params;
        const deleted = await deleteProjectRecord(id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, error: "Project not found." });
        }

        res.json({ success: true, message: "Project deleted successfully." });
    } catch (err) {
        console.error("Error in deleteProjectController:", err);
        res.status(500).json({ success: false, error: "Failed to delete project." });
    }
}
// ---------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------------------