const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    addDependent,
    removeDependent,
    getUsersByRole
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all users - admin only
router.get('/', adminAuth, getAllUsers);

// Get users by role - admin only
router.get('/role/:role', adminAuth, getUsersByRole);

// Get user by ID - users can get their own, admins can get any
router.get('/:id', getUserById);

// Update user - users can update their own, admins can update any
router.put('/:id', updateUser);

// Delete user - admin only
router.delete('/:id', adminAuth, deleteUser);

// Dependent management
router.post('/:id/dependents', addDependent);
router.delete('/:id/dependents/:dependentId', removeDependent);

module.exports = router;