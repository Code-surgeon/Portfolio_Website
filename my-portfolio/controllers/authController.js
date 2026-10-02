import { getProfileInfo, findAdminByUsername, updateAdminProfile, upsertAdminPassword } from "../config/db.js"
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendTemporaryPassword } from "../utils/mailer.js";
import fs from 'fs';
import path from 'path';


/**
 * Controller to fetch public profile and bio information for the portfolio homepage and footer.
 */
export async function fetchProfileController(req, res, next) {
    console.log("Controller Request Received: Attempting to fetch profile and bio details.");
    
    try {
        const profile = await getProfileInfo();

        if (!profile) {
            console.warn("Controller Warning: Profile data not found in the database.");
            return res.status(404).json({
                success: false,
                error: "Profile information not found."
            });
        }

        console.log("Controller Success: Profile data successfully retrieved and prepared for client response.");
        return res.status(200).json({
            success: true,
            data: profile
        });

    } catch (err) {
        console.error("Controller Error [fetchProfileController]: An error occurred while processing the profile request.", {
            errorMessage: err.message,
            stack: err.stack
        });

        // Pass the error to our global errorHandler middleware
        next(err);
    }
}



// PART2 - Admin Authentication Features
// -------------------------------------------------------------------------------------------------------------------------------


/**
 * Controller to handle Admin Login.
 * Verifies credentials against the hashed password and sets up an authenticated session.
 */
export async function adminLoginController(req, res, next) {
    console.log("Controller Request Received: Processing admin login attempt.");
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        console.warn("Controller Warning: Login attempt missing username or password.");
        return res.status(400).json({
            success: false,
            error: "Username and password are required."
        });
    }

    try {
        // 1. Fetch admin record from database
        const admin = await findAdminByUsername(username);
        if (!admin) {
            console.warn(`Controller Warning: Login failed - username '${username}' not found.`);
            return res.status(401).json({
                success: false,
                error: "Invalid username or password."
            });
        }

        // 2. Compare submitted password with stored bcrypt password hash
        const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
        if (!isPasswordValid) {
            console.warn(`Controller Warning: Login failed - incorrect password for username '${username}'.`);
            return res.status(401).json({
                success: false,
                error: "Invalid username or password."
            });
        }

        // 3. Establish secure session variables
        req.session.isAdmin = true;
        req.session.adminId = admin.id;
        req.session.username = admin.username;

        console.log(`Controller Success: Admin '${username}' logged in successfully and session established.`);
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                id: admin.id,
                username: admin.username,
                email: admin.email
            }
        });

    } catch (err) {
        console.error("Controller Error [adminLoginController]: An error occurred during login.", {
            message: err.message,
            stack: err.stack
        });
        next(err);
    }
}

/**
 * Controller to handle Admin Logout.
 * Destroys the active session.
 */
export async function adminLogoutController(req, res, next) {
    console.log("Controller Request Received: Processing admin logout.");
    
    req.session.destroy((err) => {
        if (err) {
            console.error("Controller Error [adminLogoutController]: Failed to destroy session.", {
                message: err.message
            });
            return res.status(500).json({
                success: false,
                error: "Logout failed. Please try again."
            });
        }

        // Clear the session cookie on the client side
        res.clearCookie("connect.sid");
        console.log("Controller Success: Admin logged out and session destroyed.");
        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    });
}

/**
 * Controller to check if the current browser session is authorized as admin.
 */
export async function checkSessionController(req, res, next) {
    console.log("Controller Request Received: Checking session authorization status.");

    if (req.session && req.session.isAdmin) {
        console.log(`Controller Success: Active admin session verified for user ID: ${req.session.adminId}`);
        return res.status(200).json({
            success: true,
            isAuthenticated: true,
            admin: {
                id: req.session.adminId,
                username: req.session.username
            }
        });
    }

    console.log("Controller Status: No active admin session found. User is unauthenticated.");
    return res.status(200).json({
        success: true,
        isAuthenticated: false
    });
}

/**
 * Handle Admin Password Recovery / Registration via Email
 */
export async function forgotPasswordController(req, res, next) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: "Email address is required." });
        }

        // 1. Generate a secure random temporary password
        const tempPassword = crypto.randomBytes(4).toString("hex") + Math.floor(1000 + Math.random() * 9000);

        // 2. Hash the temporary password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

        // 3. Call the database function to persist the record
        await upsertAdminPassword(email, hashedPassword);

        // 4. Dispatch the temporary password via Nodemailer
        await sendTemporaryPassword(email, tempPassword);

        console.log(`[Auth] Temporary password generated and dispatched to: ${email}`);
        
        return res.status(200).json({
            success: true,
            message: "Temporary password successfully generated and sent to your email."
        });

    } catch (err) {
        console.error("Error in forgotPasswordController:", err);
        next(err); // Hands off to global error handler
    }
}

// -------------------------------------------------------------------------------------------------------------------------------

// PART3 - Admin Dashboard CRUD Features
// -------------------------------------------------------------------------------------------------------------------------------

/**
 * Controller to update admin profile settings (bio, links, email, location).
 */
export async function updateProfileController(req, res, next) {
    console.log("Controller Request Received: Updating admin profile settings.");
    const adminId = req.session.adminId; 
    const { email, linkedin_url, github_url, location, bio_summary, my_name } = req.body;
    
    try {
        // 1. Fetch the existing profile first so we can check for an old picture
        const currentProfile = await getProfileInfo(); // Replace with your actual function to fetch the profile by ID

        // 2. Determine the new picture path if a file was uploaded
        let my_picture = currentProfile ? currentProfile.my_picture : null;
        
        if (req.file) {
            const newPicturePath = `/uploads/${req.file.filename}`;

            // If there was an old picture, delete it from the file system to save storage
            if (currentProfile && currentProfile.my_picture && currentProfile.my_picture.startsWith('/uploads/')) {
                const oldFilePath = path.join(process.cwd(), 'public', currentProfile.my_picture);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlink(oldFilePath, (err) => {
                        if (err) console.error("Failed to delete old profile picture:", err);
                        else console.log("Old profile picture deleted successfully from disk.");
                    });
                }
            }

            my_picture = newPicturePath;
        }

        if (!email) {
            console.warn("Controller Warning: Profile update failed - email is required.");
            return res.status(400).json({ success: false, error: "Email address is required." });
        }

        // 3. Update the database with the new profile info and new picture path
        const updatedProfile = await updateAdminProfile(
            adminId, email, linkedin_url, github_url, location, bio_summary, my_name, my_picture
        );
        
        if (!updatedProfile) {
            console.warn(`Controller Warning: Admin ID ${adminId} not found during profile update.`);
            return res.status(404).json({ success: false, error: "Admin profile not found." });
        }

        console.log(`Controller Success: Profile updated successfully for admin ID: ${adminId}`);
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedProfile
        });

    } catch (err) {
        console.error("Controller Error [updateProfileController]: Failed to update profile.", { message: err.message, stack: err.stack });
        next(err);
    }
}
// -------------------------------------------------------------------------------------------------------------------------------