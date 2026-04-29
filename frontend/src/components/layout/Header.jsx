import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../utils/api'

function ProfileModal({ onClose }) {
  const { login } = useAuth()
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [usernameForm, setUsernameForm] = useState({ newUsername: '' })
  const [passwordMsg, setPasswordMsg] = useState(null)
  const [usernameMsg, setUsernameMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ error: true, text: 'New passwords do not match' })
      return
    }
    setLoading(true)
    try {
      await api.put('/api/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordMsg({ error: false, text: 'Password updated successfully' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordMsg({ error: true, text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.put('/api/users/me/username', { newUsername: usernameForm.newUsername })
      login(data)
      setUsernameMsg({ error: false, text: 'Username updated successfully' })
      setUsernameForm({ newUsername: '' })
    } catch (err) {
      setUsernameMsg({ error: true, text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Change Password */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.error ? 'text-red-600' : 'text-green-600'}`}>{passwordMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-300"
            >
              Update Password
            </button>
          </form>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* Change Username */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Change Username</h3>
          <form onSubmit={handleUsernameChange} className="space-y-3">
            <input
              type="text"
              placeholder="New username"
              value={usernameForm.newUsername}
              onChange={e => setUsernameForm({ newUsername: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            {usernameMsg && (
              <p className={`text-sm ${usernameMsg.error ? 'text-red-600' : 'text-green-600'}`}>{usernameMsg.text}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-300"
            >
              Update Username
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

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
                  Dashboard
                </Link>

                <Link
                  to="/projects"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname.startsWith('/projects')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Projects
                </Link>

                <Link
                  to="/tasks"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/tasks')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Tasks
                </Link>

                <Link
                  to="/timesheet"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/timesheet')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Timesheet
                </Link>

                <Link
                  to="/crm"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/crm')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  CRM
                </Link>

                <Link
                  to="/offertes"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    location.pathname.startsWith('/offertes')
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  Offertes
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
                    Manage Users
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-300">
                  <button
                    onClick={() => setShowProfile(true)}
                    className="text-right hover:opacity-70 transition-opacity"
                  >
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </button>
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
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </header>
  )
}

export default Header
