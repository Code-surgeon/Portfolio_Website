export function requireAdmin(req, res, next) {
    // Check if the session indicates the user is logged in as admin
    if (req.session && req.session.isAdmin) {
        return next(); // User is authenticated, proceed to controller
    }
    
    // If not authenticated, reject with 401 Unauthorized
    return res.status(401).json({ error: "Unauthorized. Please log in to your admin account." });
}