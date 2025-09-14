const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userAuth");
const jwtAuthenticator = require("../middlewares/jwt");

// Temporary storage for authentication data transfer
let tempAuthStorage = new Map();

router.post("/signup", usersController.usersSignup);
router.post("/login", usersController.usersLogin);
router.get("/validate", jwtAuthenticator, usersController.validateToken);

// Store temporary auth data (for Google Apps Script integration)
router.post("/store-temp-auth", (req, res) => {
    try {
        const { token, email, sessionId } = req.body;
        
        if (!token || !email || !sessionId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        // Store temporarily (expires in 5 minutes)
        tempAuthStorage.set(sessionId, { token, email, timestamp: Date.now() });
        
        // Auto-cleanup after 5 minutes
        setTimeout(() => {
            tempAuthStorage.delete(sessionId);
        }, 5 * 60 * 1000);
        
        res.json({ success: true, message: 'Auth data stored temporarily' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Retrieve and consume temporary auth data
router.get("/get-temp-auth/:sessionId", (req, res) => {
    try {
        const { sessionId } = req.params;
        const authData = tempAuthStorage.get(sessionId);
        
        if (!authData) {
            return res.status(404).json({ 
                success: false, 
                message: 'No authentication data found or expired' 
            });
        }
        
        // Check if data is expired (5 minutes)
        if (Date.now() - authData.timestamp > 5 * 60 * 1000) {
            tempAuthStorage.delete(sessionId);
            return res.status(404).json({ 
                success: false, 
                message: 'Authentication data expired' 
            });
        }
        
        // Return and delete the data (one-time use)
        tempAuthStorage.delete(sessionId);
        res.json({ 
            success: true, 
            token: authData.token, 
            email: authData.email 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;