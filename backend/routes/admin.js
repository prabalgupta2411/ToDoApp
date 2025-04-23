const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Todo = require('../models/Todo');
const { auth, isAdmin } = require('../middleware/auth');
const { updateRoleValidation, validate } = require('../middleware/validation');

// Get all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
        
        res.json({
            users,
            total: users.length,
            active: activeUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get todos by user ID (admin only)
router.get('/users/:userId/todos', auth, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const todos = await Todo.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('user', 'username email');
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user todos', error: error.message });
    }
});

// Get todo statistics (admin only)
router.get('/todos/stats', auth, isAdmin, async (req, res) => {
    try {
        const totalTodos = await Todo.countDocuments();
        const completedTodos = await Todo.countDocuments({ completed: true });
        const pendingTodos = totalTodos - completedTodos;

        // Get todos by category
        const todosByCategory = await Todo.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Get todos by user
        const todosByUser = await Todo.aggregate([
            { $group: { _id: '$user', count: { $sum: 1 } } },
            { $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
            },
            { $unwind: '$user' },
            { $project: {
                username: '$user.username',
                email: '$user.email',
                count: 1
            }
            }
        ]);

        res.json({
            total: totalTodos,
            completed: completedTodos,
            pending: pendingTodos,
            byCategory: todosByCategory,
            byUser: todosByUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todo statistics', error: error.message });
    }
});

// Get all todos
router.get('/todos', auth, isAdmin, async (req, res) => {
    try {
        const todos = await Todo.find().populate('user', 'username email');
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error: error.message });
    }
});

// Update user role (admin only)
router.put('/users/:userId/role', auth, isAdmin, updateRoleValidation, validate, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ 
            message: 'User role updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

module.exports = router; 