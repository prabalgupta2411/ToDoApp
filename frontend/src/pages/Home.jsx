import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Welcome to Todo App
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        A simple and efficient way to manage your tasks
      </p>

      {!isAuthenticated ? (
        <div className="space-y-4">
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Organize Tasks</h2>
          <p className="text-gray-600">
            Keep track of your tasks with categories and due dates
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Stay Productive</h2>
          <p className="text-gray-600">
            Mark tasks as complete and focus on what matters
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Easy Access</h2>
          <p className="text-gray-600">
            Access your tasks from anywhere, anytime
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home; 