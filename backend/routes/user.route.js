import express from 'express';
import { login, logout, register, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { multipleUpload } from '../middlewares/multer.js';

const router = express.Router();

// ======================= USER AUTH ROUTES =======================

// Register a new user (profile photo optional)
// multer middleware parses multipart form data before controller
router.post('/register', multipleUpload, register);

// Login user
router.post('/login', login);

// Logout user - POST and GET for convenience
router.post('/logout', logout);
router.get('/logout', logout);

// Update user profile (protected route)
// Authenticate first, then parse multipart form data
router.put('/profile/update', isAuthenticated, multipleUpload, updateProfile);

export default router;
