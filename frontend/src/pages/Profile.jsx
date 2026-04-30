import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'
import { api } from '../utils/api'

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Profile() {
  const { user, login } = useAuth()
  const { t } = useLang()

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordMsg, setPasswordMsg] = useState(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [usernameForm, setUsernameForm] = useState({ newUsername: '' })
  const [usernameMsg, setUsernameMsg] = useState(null)
  const [usernameLoading, setUsernameLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ error: true, text: t.profile.pwdMismatch })
      return
    }
    setPasswordLoading(true)
    setPasswordMsg(null)
    try {
      await api.put('/api/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordMsg({ error: false, text: t.profile.pwdSuccess })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordMsg({ error: true, text: err.message })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleUsernameChange = async (e) => {
    e.preventDefault()
    setUsernameLoading(true)
    setUsernameMsg(null)
    try {
      const data = await api.put('/api/users/me/username', { newUsername: usernameForm.newUsername })
      login(data)
      setUsernameMsg({ error: false, text: t.profile.usernameSuccess })
      setUsernameForm({ newUsername: '' })
    } catch (err) {
      setUsernameMsg({ error: true, text: err.message })
    } finally {
      setUsernameLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-amber-600 text-white rounded-lg p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.profile.title}</h1>
          <p className="text-sm text-gray-400">{t.profile.subtitle || 'Manage your account settings'}</p>
        </div>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-white text-xl font-bold">
            {initials(user?.fullName || user?.username)}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{user?.fullName || user?.username}</div>
            <div className="text-sm text-gray-500">@{user?.username}</div>
            <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
              user?.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">{t.profile.changePassword}</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t.profile.currentPwd}</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t.profile.newPwd}</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t.profile.confirmPwd}</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
          {passwordMsg && (
            <p className={`text-sm ${passwordMsg.error ? 'text-red-600' : 'text-green-600'}`}>{passwordMsg.text}</p>
          )}
          <button
            type="submit"
            disabled={passwordLoading}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {passwordLoading ? '…' : t.profile.updatePwd}
          </button>
        </form>
      </div>

      {/* Change Username */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">{t.profile.changeUsername}</h2>
        <form onSubmit={handleUsernameChange} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t.profile.newUsername}</label>
            <input
              type="text"
              value={usernameForm.newUsername}
              onChange={e => setUsernameForm({ newUsername: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          {usernameMsg && (
            <p className={`text-sm ${usernameMsg.error ? 'text-red-600' : 'text-green-600'}`}>{usernameMsg.text}</p>
          )}
          <button
            type="submit"
            disabled={usernameLoading}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {usernameLoading ? '…' : t.profile.updateUsername}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile