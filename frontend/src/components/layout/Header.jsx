import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLang } from '../../contexts/LanguageContext'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const { lang, toggle, t } = useLang()

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
          <Link to={isAuthenticated() ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-amber-700 rounded-lg p-2">
              <img
                src="/LOGO-CLT-XPRT-WIT-RECHTHOOK-1-e1708081916795.png"
                alt="CLTXPRT Logo"
                className="h-10"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CLTXPRT</h1>
              <p className="text-xs text-gray-500">CLT Construction Platform</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {isAuthenticated() && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t.nav.dashboard}
                </Link>

                <Link
                  to="/projects"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname.startsWith('/projects')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t.nav.projects}
                </Link>

                <Link
                  to="/tasks"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/tasks')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t.nav.tasks}
                </Link>

                <Link
                  to="/timesheet"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/timesheet')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t.nav.timesheet}
                </Link>

                <Link
                  to="/crm"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/crm')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t.nav.crm}
                </Link>

                <Link
                  to="/offertes"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname.startsWith('/offertes')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t.nav.offertes}
                </Link>

                {isAdmin() && (
                  <Link
                    to="/users"
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive('/users')
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {t.nav.manageUsers}
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-300">
                  <button
                    onClick={toggle}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    {lang === 'nl' ? 'NL' : 'EN'}
                  </button>
                  <Link
                    to="/profile"
                    className={`text-right hover:opacity-70 transition-opacity ${location.pathname === '/profile' ? 'opacity-70' : ''}`}
                  >
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {t.nav.logout}
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated() && (
              <Link
                to="/login"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              >
                {t.nav.login}
              </Link>
            )}
          </nav>
        </div>
      </div>

    </header>
  )
}

export default Header
