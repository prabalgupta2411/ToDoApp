const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const Todo = require('../models/Todo');
const { todoValidation, validate } = require('../middleware/validation');

// Create a new todo
router.post('/', auth, todoValidation, validate, async (req, res) => {
    try {
        const todo = new Todo({
            ...req.body,
            user: req.user._id
        });

        await todo.save();
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error: error.message });
    }
});

// Get all todos (user-specific or all for admin)
router.get('/', auth, async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user._id };
        
        // Apply filters
        if (req.query.completed) {
            query.completed = req.query.completed === 'true';
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        const todos = await Todo.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'username email');

        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error: error.message });
    }
});

// Get a single todo
router.get('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            $or: [
                { user: req.user._id },
                ...(req.user.role === 'admin' ? [{}] : [])
            ]
        }).populate('user', 'username email');

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todo', error: error.message });
    }
});

// Update a todo
router.put('/:id', auth, todoValidation, validate, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check permissions
        if (req.user.role !== 'admin' && todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this todo' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('user', 'username email');

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error: error.message });
    }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check permissions
        if (req.user.role !== 'admin' && todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this todo' });
        }

        await todo.remove();
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error: error.message });
    }
});

module.exports = router; 