import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 rounded-lg p-2">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BIM Drawing Manager</h1>
              <p className="text-xs text-gray-500">Streamline your drawing workflow</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {isAuthenticated() && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/dashboard') || location.pathname.startsWith('/projects')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Projects
                </Link>

                {isAdmin() && (
                  <Link
                    to="/users"
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive('/users')
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    Manage Users
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-300">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated() && (
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header