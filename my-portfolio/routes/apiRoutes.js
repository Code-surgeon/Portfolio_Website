import express from "express";
import { fetchProfileController } from "../controllers/authController.js";
import { fetchAllProjectsController, fetchFeaturedProjectsController, fetchSkillsController,
    fetchExperiencesController, fetchActivitiesController, submitContactController
 } from "../controllers/controllers.js";

const router = express.Router();

/**
 * @route   GET /api/profile
 * @desc    Fetch public profile, tagline, and contact links for the homepage/footer
 * @access  Public
 */
router.get("/profile", fetchProfileController);

// (We will add more public API routes here as we build other features, like projects, skills, etc.)



// ==========================================
// 1. Profile & Bio Routes
// ==========================================
/**
 * @route   GET /api/profile
 * @desc    Fetch public profile, tagline, and contact links for homepage/footer
 * @access  Public
 */
router.get("/profile", fetchProfileController);


// ==========================================
// 2. Projects Routes
// ==========================================
/**
 * @route   GET /api/projects
 * @desc    Fetch all projects for the main projects view page
 * @access  Public
 */
router.get("/projects", fetchAllProjectsController);

/**
 * @route   GET /api/projects/featured
 * @desc    Fetch featured projects (limited to top 3) for the homepage dashboard
 * @access  Public
 */
router.get("/projects/featured", fetchFeaturedProjectsController);


// ==========================================
// 3. Skills Routes
// ==========================================
/**
 * @route   GET /api/skills
 * @desc    Fetch all technical skills grouped by category
 * @access  Public
 */
router.get("/skills", fetchSkillsController);


// ==========================================
// 4. Experience & Education Routes
// ==========================================
/**
 * @route   GET /api/experiences
 * @desc    Fetch all education and work history records
 * @access  Public
 */
router.get("/experiences", fetchExperiencesController);


// ==========================================
// 5. Professional Activities Routes
// ==========================================
/**
 * @route   GET /api/activities
 * @desc    Fetch hackathons, certifications, and professional events
 * @access  Public
 */
router.get("/activities", fetchActivitiesController);


// ==========================================
// 6. Contact Form Submission Route
// ==========================================
/**
 * @route   POST /api/contact
 * @desc    Receive and save a message submitted from the public contact form
 * @access  Public
 */
router.post("/contact", submitContactController);

export default router;