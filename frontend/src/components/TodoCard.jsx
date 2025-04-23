import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const TodoCard = ({ todo, onDelete, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { api } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;

    setIsLoading(true);
    try {
      await api.delete(`/api/todos/${todo._id}`);
      onDelete(todo._id);
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await api.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed
      });
      onUpdate(response.data);
      toast.success(`Todo marked as ${!todo.completed ? 'completed' : 'incomplete'}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update todo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
      todo.category === 'Urgent' ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <button
              onClick={handleToggleComplete}
              disabled={isLoading}
              className={`mr-2 p-1 rounded-full ${
                todo.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <h3 className={`text-lg font-medium ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
          </div>
          {todo.description && (
            <p className="mt-1 text-sm text-gray-500">{todo.description}</p>
          )}
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              todo.category === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {todo.category}
            </span>
            {todo.dueDate && (
              <span className="ml-2">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/todos/${todo._id}/edit`}
            className="p-1 text-gray-400 hover:text-primary-600"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-red-600"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard; 