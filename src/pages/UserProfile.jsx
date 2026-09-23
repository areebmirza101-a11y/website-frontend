import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, Shield } from 'lucide-react';

const UserProfile = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
      <h1 className="text-3xl font-bold mb-8 transition-colors duration-300">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-24 w-24 rounded-full bg-accent text-white flex items-center justify-center text-4xl font-bold shadow-lg shadow-accent/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold transition-colors duration-300">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 transition-colors duration-300">
              <Mail className="h-4 w-4" /> {user.email}
            </p>
            {isAdmin && (
              <p className="text-accent mt-2 flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" /> Admin Account
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8 transition-colors duration-300">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
