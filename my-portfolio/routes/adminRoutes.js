import express from "express";
import { 
    adminLoginController, 
    adminLogoutController, 
    checkSessionController,
    updateProfileController, forgotPasswordController 
} from "../controllers/authController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

import { createSkillController, deleteSkillController, createExperienceController, deleteExperienceController,
    createActivityController, deleteActivityController, fetchAllMessagesController, markMessageReadController, 
    deleteMessageController, updateSkillController, updateExperienceController, updateActivityController,
	createProjectController, deleteProjectController
 } from "../controllers/controllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ==========================================
// 1. Admin Authentication Routes
// ==========================================
router.post("/login", adminLoginController);
router.post("/logout", requireAdmin, adminLogoutController);
router.get("/status", checkSessionController);
router.post("/forgot-password", forgotPasswordController);


// ==========================================
// 2. Admin Profile Settings Route
// ==========================================
router.put("/profile", requireAdmin, upload.single('profile_image'), updateProfileController);


// ==========================================
// 3. Admin Skills Management Routes
// ==========================================
router.post("/skills", requireAdmin, createSkillController);
router.delete("/skills/:id", requireAdmin, deleteSkillController);
router.put("/skills/:id", requireAdmin, updateSkillController);


// ==========================================
// 4. Admin Experience Management Routes
// ==========================================
router.post("/experiences", requireAdmin, createExperienceController);
router.delete("/experiences/:id", requireAdmin, deleteExperienceController);
router.put("/experiences/:id", requireAdmin, updateExperienceController);


// ==========================================
// 5. Admin Professional Activities Routes
// ==========================================
router.post("/activities", requireAdmin, createActivityController);
router.delete("/activities/:id", requireAdmin, deleteActivityController);
router.put("/activities/:id", requireAdmin, updateActivityController);


// ==========================================
// 6. Admin Contact Messages Management Routes
// ==========================================
router.get("/messages", requireAdmin, fetchAllMessagesController);
router.patch("/messages/:id/read", requireAdmin, markMessageReadController);
router.delete("/messages/:id", requireAdmin, deleteMessageController);


// 5. Admin Professional Activities Routes
// ==========================================
router.post("/projects", requireAdmin, createProjectController);
router.delete("/projects/:id", requireAdmin, deleteProjectController);

export default router;