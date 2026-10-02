import pg from "pg"
import dotenv from "dotenv"
dotenv.config()


// Create PostgreSQL connection pool
export const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection on initialization
pool.on('connect', () => {
  console.log('PostgreSQL database pool connected successfully.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

/**
 * Universal query runner with execution timing
 */
const query = (text, params) => pool.query(text, params);



// PART 1 - Public-Facing Features
// -------------------------------------------------------------------------------------------------------------------------------
/**
 * Fetch the primary portfolio profile and bio details from the admins table.
 * Since this is a personal portfolio, we pull the first record.
 */
export async function getProfileInfo() {
    const client = await pool.connect();
    try {
        console.log("Database Query: Fetching portfolio profile and bio information...");
        
        const result = await client.query(
            `
            SELECT 
                id, 
                username, 
                email, 
                linkedin_url, 
                github_url, 
                location, 
                bio_summary,
                my_picture,
                my_name, 
                created_at
            FROM admins
            LIMIT 1;
            `
        );

        if (result.rows.length === 0) {
            console.warn("Database Warning: No profile record found in the 'admins' table.");
            return null;
        }

        console.log("Database Success: Profile information retrieved successfully.");
        return result.rows[0];
        
    } catch (err) {
        console.error("Database Error [getProfileInfo]: Failed to fetch profile info from PostgreSQL.", {
            errorName: err.name,
            errorMessage: err.message,
            errorDetail: err.detail || "No extra database detail provided"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client back to the pool for getProfileInfo.");
    }
}



/**
 * Fetch all projects sorted by display order and creation date.
 */
export async function getAllProjects() {
    const client = await pool.connect();
    try {
        console.log("Database Query: Fetching all projects...");
        const result = await client.query(
            `SELECT * FROM projects ORDER BY display_order ASC, created_at DESC;`
        );
        console.log(`Database Success: Retrieved ${result.rows.length} projects.`);
        return result.rows;
    } catch (err) {
        console.error("Database Error [getAllProjects]: Failed to fetch projects.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for getAllProjects.");
    }
}

/**
 * Fetch only featured projects for the homepage dashboard (limited to top 3).
 */
export async function getFeaturedProjects() {
    const client = await pool.connect();
    try {
        console.log("Database Query: Fetching featured projects for homepage...");
        const result = await client.query(
            `SELECT * FROM projects WHERE is_featured = TRUE ORDER BY display_order ASC LIMIT 3;`
        );
        console.log(`Database Success: Retrieved ${result.rows.length} featured projects.`);
        return result.rows;
    } catch (err) {
        console.error("Database Error [getFeaturedProjects]: Failed to fetch featured projects.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for getFeaturedProjects.");
    }
}


/**
 * Fetch all technical skills sorted by category and display order.
 */
export async function getAllSkills() {
    const client = await pool.connect();
    try {
        console.log("Database Query: Fetching all technical skills...");
        const result = await client.query(
            `SELECT * FROM skills ORDER BY category ASC, display_order ASC;`
        );
        console.log(`Database Success: Retrieved ${result.rows.length} skills.`);
        return result.rows;
    } catch (err) {
        console.error("Database Error [getAllSkills]: Failed to fetch skills.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for getAllSkills.");
    }
}




/**
 * Fetch all experience and education records sorted by display order.
 */
export async function getAllExperiences() {
    const client = await pool.connect();
    try {
        console.log("Database Query: Fetching all experience and education records...");
        const result = await client.query(
            `SELECT * FROM experiences ORDER BY display_order ASC;`
        );
        console.log(`Database Success: Retrieved ${result.rows.length} experience records.`);
        return result.rows;
    } catch (err) {
        console.error("Database Error [getAllExperiences]: Failed to fetch experiences.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for getAllExperiences.");
    }
}


/**
 * Fetch all professional activities and achievements.
 */
export async function getAllActivities() {
    const client = await pool.connect();
    try {
        console.log("Database Query: Fetching all professional activities...");
        const result = await client.query(
            `SELECT * FROM professional_activities ORDER BY display_order ASC;`
        );
        console.log(`Database Success: Retrieved ${result.rows.length} professional activities.`);
        return result.rows;
    } catch (err) {
        console.error("Database Error [getAllActivities]: Failed to fetch professional activities.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for getAllActivities.");
    }
}


/**
 * Insert a new contact message submitted from the public portfolio form.
 */
export async function createContactMessage(senderName, senderEmail, messageBody) {
    const client = await pool.connect();
    try {
        console.log("Database Query: Inserting new contact message into database...");
        const result = await client.query(
            `
            INSERT INTO messages (sender_name, sender_email, message_body)
            VALUES ($1, $2, $3)
            RETURNING id, sender_name, sender_email, created_at;
            `,
            [senderName, senderEmail, messageBody]
        );
        console.log("Database Success: Contact message saved successfully with ID:", result.rows[0].id);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [createContactMessage]: Failed to insert contact message.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for createContactMessage.");
    }
}
// -------------------------------------------------------------------------------------------------------------------------------


// PART2 - Admin Authentication Features
// -------------------------------------------------------------------------------------------------------------------------------
/**
 * Find an admin account by username to verify login credentials.
 */
export async function findAdminByUsername(username) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Searching for admin account with username: ${username}`);
        
        const result = await client.query(
            `
            SELECT id, username, password_hash, email 
            FROM admins 
            WHERE username = $1;
            `,
            [username]
        );

        if (result.rows.length === 0) {
            console.warn(`Database Warning: No admin account found with username: ${username}`);
            return null;
        }

        console.log(`Database Success: Admin account found for username: ${username}`);
        return result.rows[0];

    } catch (err) {
        console.error("Database Error [findAdminByUsername]: Failed to query admin credentials.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for findAdminByUsername.");
    }
}
export async function upsertAdminPassword(email, hashedPassword) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Upserting admin password for email: ${email}...`);
        
        const username = email.split("@")[0]; // Derive default username from email prefix
        
        const query = `
            INSERT INTO admins (username, email, password_hash)
            VALUES ($1, $2, $3)
            ON CONFLICT (username) 
            DO UPDATE SET email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, updated_at = NOW()
            RETURNING id, username, email;
        `;

        const result = await client.query(query, [username, email, hashedPassword]);
        
        console.log(`Database Success: Admin record successfully saved for email: ${email}`);
        return result.rows[0];

    } catch (err) {
        console.error("Database Error [upsertAdminPassword]: Failed to save admin record.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for upsertAdminPassword.");
    }
}
// -------------------------------------------------------------------------------------------------------------------------------


// PART3 - Admin Dashboard CRUD Features
// -------------------------------------------------------------------------------------------------------------------------------

// SKILL MANAGEMENT
// ---------------------------------------------------------------------------------
/**
 * Insert a new technical skill into the database.
 */
export async function createSkill(category, skillName, status, displayOrder) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Adding new skill '${skillName}' under category '${category}'...`);
        const result = await client.query(
            `
            INSERT INTO skills (category, skill_name, status, display_order)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [category, skillName, status || 'actively using', displayOrder || 0]
        );
        console.log(`Database Success: Skill added successfully with ID: ${result.rows[0].id}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [createSkill]: Failed to insert new skill.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for createSkill.");
    }
}

/**
 * Delete a technical skill by its ID.
 */
export async function deleteSkill(skillId) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Deleting skill with ID: ${skillId}...`);
        const result = await client.query(
            `DELETE FROM skills WHERE id = $1 RETURNING id;`,
            [skillId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Skill with ID ${skillId} not found for deletion.`);
            return null;
        }
        console.log(`Database Success: Skill deleted with ID: ${skillId}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [deleteSkill]: Failed to delete skill.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for deleteSkill.");
    }
}

export async function updateSkill(skillId, category, skillName, status, displayOrder) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Updating skill ID ${skillId}...`);
        const result = await client.query(
            `
            UPDATE skills 
            SET category = $1, skill_name = $2, status = $3, display_order = $4
            WHERE id = $5
            RETURNING *;
            `,
            [category, skillName, status, displayOrder || 0, skillId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Skill ID ${skillId} not found for update.`);
            return null;
        }
        console.log(`Database Success: Skill ID ${skillId} updated successfully.`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [updateSkill]: Failed to update skill.", { message: err.message });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for updateSkill.");
    }
}
// ---------------------------------------------------------------------------------



// EXPERIENCE MANAGEMENT
// ---------------------------------------------------------------------------------
/**
 * Insert a new experience or education record.
 */
export async function createExperience(type, title, institutionOrCompany, location, startDate, endDate, description, displayOrder) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Adding new ${type} record: '${title}' at '${institutionOrCompany}'...`);
        const result = await client.query(
            `
            INSERT INTO experiences (type, title, institution_or_company, location, start_date, end_date, description, display_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
            `,
            [type, title, institutionOrCompany, location, startDate, endDate, description, displayOrder || 0]
        );
        console.log(`Database Success: Experience record created with ID: ${result.rows[0].id}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [createExperience]: Failed to insert experience record.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for createExperience.");
    }
}

/**
 * Delete an experience or education record by its ID.
 */
export async function deleteExperience(experienceId) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Deleting experience record with ID: ${experienceId}...`);
        const result = await client.query(
            `DELETE FROM experiences WHERE id = $1 RETURNING id;`,
            [experienceId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Experience record with ID ${experienceId} not found for deletion.`);
            return null;
        }
        console.log(`Database Success: Experience record deleted with ID: ${experienceId}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [deleteExperience]: Failed to delete experience record.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for deleteExperience.");
    }
}

export async function updateExperience(experienceId, type, title, institutionOrCompany, location, startDate, endDate, description, displayOrder) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Updating experience ID ${experienceId}...`);
        const result = await client.query(
            `
            UPDATE experiences 
            SET type = $1, title = $2, institution_or_company = $3, location = $4, 
                start_date = $5, end_date = $6, description = $7, display_order = $8
            WHERE id = $9
            RETURNING *;
            `,
            [type, title, institutionOrCompany, location, startDate, endDate, description, displayOrder || 0, experienceId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Experience ID ${experienceId} not found for update.`);
            return null;
        }
        console.log(`Database Success: Experience ID ${experienceId} updated successfully.`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [updateExperience]: Failed to update experience.", { message: err.message });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for updateExperience.");
    }
}
// ---------------------------------------------------------------------------------


// ACTIVITY MANAGEMENT
// ---------------------------------------------------------------------------------
/**
 * Insert a new professional activity or certification.
 */
export async function createActivity(eventName, organization, date, description, certificateUrl, displayOrder) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Adding professional activity '${eventName}' by '${organization}'...`);
        const result = await client.query(
            `
            INSERT INTO professional_activities (event_name, organization, date, description, certificate_url, display_order)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `,
            [eventName, organization, date, description, certificateUrl, displayOrder || 0]
        );
        console.log(`Database Success: Professional activity created with ID: ${result.rows[0].id}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [createActivity]: Failed to insert professional activity.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for createActivity.");
    }
}

/**
 * Delete a professional activity by its ID.
 */
export async function deleteActivity(activityId) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Deleting professional activity with ID: ${activityId}...`);
        const result = await client.query(
            `DELETE FROM professional_activities WHERE id = $1 RETURNING id;`,
            [activityId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Professional activity with ID ${activityId} not found for deletion.`);
            return null;
        }
        console.log(`Database Success: Professional activity deleted with ID: ${activityId}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [deleteActivity]: Failed to delete professional activity.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for deleteActivity.");
    }
}

export async function updateActivity(activityId, eventName, organization, date, description, certificateUrl, displayOrder) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Updating professional activity ID ${activityId}...`);
        const result = await client.query(
            `
            UPDATE professional_activities 
            SET event_name = $1, organization = $2, date = $3, description = $4, 
                certificate_url = $5, display_order = $6
            WHERE id = $7
            RETURNING *;
            `,
            [eventName, organization, date, description, certificateUrl, displayOrder || 0, activityId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Activity ID ${activityId} not found for update.`);
            return null;
        }
        console.log(`Database Success: Professional activity ID ${activityId} updated successfully.`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [updateActivity]: Failed to update professional activity.", { message: err.message });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for updateActivity.");
    }
}
// ---------------------------------------------------------------------------------



// MESSAGE MANAGEMENT
// ---------------------------------------------------------------------------------
/**
 * Fetch all contact messages for the admin dashboard (newest first).
 */
export async function getAllMessages() {
    const client = await pool.connect();
    try {
        console.log("Database Query: Fetching all contact messages for admin view...");
        const result = await client.query(
            `SELECT * FROM messages ORDER BY created_at DESC;`
        );
        console.log(`Database Success: Retrieved ${result.rows.length} messages.`);
        return result.rows;
    } catch (err) {
        console.error("Database Error [getAllMessages]: Failed to fetch messages.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for getAllMessages.");
    }
}

/**
 * Mark a contact message as read.
 */
export async function markMessageAsRead(messageId) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Marking message ID ${messageId} as read...`);
        const result = await client.query(
            `
            UPDATE messages 
            SET is_read = TRUE 
            WHERE id = $1 
            RETURNING *;
            `,
            [messageId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Message ID ${messageId} not found to mark as read.`);
            return null;
        }
        console.log(`Database Success: Message ID ${messageId} marked as read.`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [markMessageAsRead]: Failed to update message status.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for markMessageAsRead.");
    }
}

/**
 * Delete a contact message by its ID.
 */
export async function deleteMessage(messageId) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Deleting message ID ${messageId}...`);
        const result = await client.query(
            `DELETE FROM messages WHERE id = $1 RETURNING id;`,
            [messageId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Message ID ${messageId} not found for deletion.`);
            return null;
        }
        console.log(`Database Success: Message deleted with ID: ${messageId}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [deleteMessage]: Failed to delete message.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for deleteMessage.");
    }
}
// ---------------------------------------------------------------------------------


// PROJECT MANAGEMENT
// ---------------------------------------------------------------------------------
export async function getProjects() {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM public.projects ORDER BY display_order ASC, id DESC;`;
        const result = await client.query(query);
        return result.rows;
    } finally {
        client.release();
    }
}

export async function createProject({ 
    title, 
    short_description, 
    full_description, 
    problem_solved, 
    my_role, 
    tech_stack, 
    github_url, 
    live_url, 
    video_url, 
    is_featured, 
    display_order 
}) {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO public.projects 
            (title, short_description, full_description, problem_solved, my_role, tech_stack, github_url, live_url, video_url, is_featured, display_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
        const values = [
            title, 
            short_description || '', 
            full_description || null, 
            problem_solved || null, 
            my_role || null, 
            tech_stack, 
            github_url || null, 
            live_url || null, 
            video_url || null, 
            is_featured || false, 
            display_order || 0
        ];
        const result = await client.query(query, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

export async function deleteProjectRecord(id) {
    const client = await pool.connect();
    try {
        const query = `DELETE FROM public.projects WHERE id = $1 RETURNING id;`;
        const result = await client.query(query, [id]);
        return result.rows[0];
    } finally {
        client.release();
    }
}
// ---------------------------------------------------------------------------------------



/**
 * Update the admin profile details (bio summary, email, GitHub, LinkedIn, location).
 */
export async function updateAdminProfile(adminId, email, linkedinUrl, githubUrl, location, bioSummary, myName, myPicture) {
    const client = await pool.connect();
    try {
        console.log(`Database Query: Updating profile info for admin ID: ${adminId}...`);
        const result = await client.query(
            `
            UPDATE admins 
            SET email = $1, 
                linkedin_url = $2, 
                github_url = $3, 
                location = $4, 
                bio_summary = $5,
                my_name = $6,
                my_picture = $7
            WHERE id = $8
            RETURNING id, username, email, linkedin_url, github_url, location, bio_summary, my_name, my_picture;
            `,
            [email, linkedinUrl, githubUrl, location, bioSummary, myName, myPicture, adminId]
        );
        if (result.rows.length === 0) {
            console.warn(`Database Warning: Admin ID ${adminId} not found for profile update.`);
            return null;
        }
        console.log(`Database Success: Profile updated successfully for admin ID: ${adminId}`);
        return result.rows[0];
    } catch (err) {
        console.error("Database Error [updateAdminProfile]: Failed to update profile settings.", {
            message: err.message,
            detail: err.detail || "None"
        });
        throw err;
    } finally {
        client.release();
        console.log("Database Connection: Released client for updateAdminProfile.");
    }
}
// -------------------------------------------------------------------------------------------------------------------------------



