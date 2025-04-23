import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  UserIcon, 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTodos: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTodos, setUserTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    active: 'all'
  });
  const [todoFilters, setTodoFilters] = useState({
    category: 'all',
    completed: 'all',
    search: ''
  });
  const { updateUserRole, api } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserTodos(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchStats = async () => {
    try {
      console.log('Fetching stats...');
      const [usersResponse, todosResponse] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/todos/stats')
      ]);
      console.log('Stats response:', todosResponse.data);

      setStats({
        totalUsers: usersResponse.data.total,
        totalTodos: todosResponse.data.total || 0,
        activeUsers: usersResponse.data.active
      });
    } catch (error) {
      console.error('Error fetching stats:', error.response || error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch statistics';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || 'Failed to fetch users');
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTodos = async (userId) => {
    try {
      console.log('Fetching todos for user:', userId);
      const response = await api.get(`/api/admin/users/${userId}/todos`);
      console.log('Todos response:', response.data);
      setUserTodos(response.data);
    } catch (error) {
      console.error('Error fetching user todos:', error.response || error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch user todos';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false;
    }
    if (filters.active !== 'all') {
      const isActive = filters.active === 'active';
      const lastActive = new Date(user.lastActive);
      const isUserActive = lastActive > new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (isUserActive !== isActive) {
        return false;
      }
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const filteredTodos = userTodos.filter(todo => {
    if (todoFilters.category !== 'all' && todo.category !== todoFilters.category) {
      return false;
    }
    if (todoFilters.completed !== 'all') {
      const isCompleted = todoFilters.completed === 'completed';
      if (todo.completed !== isCompleted) {
        return false;
      }
    }
    if (todoFilters.search) {
      const searchTerm = todoFilters.search.toLowerCase();
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
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.totalUsers}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <UserIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Users
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.activeUsers}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Todos
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.totalTodos}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Management
            </h3>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.active}
                onChange={(e) => setFilters({ ...filters, active: e.target.value })}
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user._id}
                    className={`hover:bg-gray-50 cursor-pointer ${selectedUser?._id === user._id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        new Date(user.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(user.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoleUpdate(user._id, user.role === 'admin' ? 'user' : 'admin');
                        }}
                        className={`text-sm font-medium ${
                          user.role === 'admin'
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-blue-600 hover:text-blue-900'
                        }`}
                      >
                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Todos Section */}
      {selectedUser && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedUser.username}'s Todos
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search todos..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={todoFilters.search}
                    onChange={(e) => setTodoFilters({ ...todoFilters, search: e.target.value })}
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={todoFilters.category}
                  onChange={(e) => setTodoFilters({ ...todoFilters, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Non-Urgent">Non-Urgent</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={todoFilters.completed}
                  onChange={(e) => setTodoFilters({ ...todoFilters, completed: e.target.value })}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>
              </div>
            </div>

            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No todos found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo._id}
                    className={`bg-white border-l-4 ${
                      todo.category === 'Urgent' ? 'border-red-500' : 'border-blue-500'
                    } rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div
                            className={`mr-2 p-1 rounded-full ${
                              todo.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </div>
                          <h3
                            className={`text-lg font-medium ${
                              todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}
                          >
                            {todo.title}
                          </h3>
                        </div>
                        {todo.description && (
                          <p className="mt-1 text-sm text-gray-500">{todo.description}</p>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              todo.category === 'Urgent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {todo.category}
                          </span>
                          {todo.dueDate && (
                            <span className="ml-2">
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 