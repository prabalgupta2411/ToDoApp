import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import TodoCard from '../components/TodoCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    completed: 'all',
    search: ''
  });
  const { user, api } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/api/todos');
      const userTodos = response.data.filter(todo => todo.user._id === user._id);
      setTodos(userTodos);
      setError(null);
    } catch (error) {
      setError('Failed to fetch todos');
      toast.error(error.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (todoId) => {
    setTodos(todos.filter(todo => todo._id !== todoId));
  };

  const handleUpdate = (updatedTodo) => {
    setTodos(todos.map(todo => 
      todo._id === updatedTodo._id ? updatedTodo : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filters.category !== 'all' && todo.category !== filters.category) {
      return false;
    }
    if (filters.completed !== 'all') {
      const isCompleted = filters.completed === 'completed';
      if (todo.completed !== isCompleted) {
        return false;
      }
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
        <Link
          to="/todos/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="text-black h-5 w-5 mr-2" />
          New Todo
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search todos..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="all">All Categories</option>
              <option value="Urgent">Urgent</option>
              <option value="Non-Urgent">Non-Urgent</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={filters.completed}
              onChange={(e) => setFilters({ ...filters, completed: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No todos found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTodos.map(todo => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 