const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    description: {
        type: String,
        maxlength: 500,
        trim: true
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String,
        enum: ['Urgent', 'Non-Urgent'],
        default: 'Non-Urgent'
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Create indexes
todoSchema.index({ user: 1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ category: 1 });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo; 