import { useEffect, useState, useRef } from 'react'
import { api } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function Timesheet() {
  const { isAdmin } = useAuth()
  const { t } = useLang()
  const [entries, setEntries] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Timer state
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [timerProjectId, setTimerProjectId] = useState('')
  const [timerDescription, setTimerDescription] = useState('')
  const [timerError, setTimerError] = useState(null)
  const intervalRef = useRef(null)

  // Edit modal state
  const [editEntry, setEditEntry] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    fetchEntries()
    fetchProjects()
    return () => clearInterval(intervalRef.current)
  }, [])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const data = await api.get('/api/time-entries')
      setEntries(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const data = await api.get('/api/projects')
      setProjects(data)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    }
  }

  const startTimer = () => {
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
  }

  const resetTimer = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setElapsed(0)
  }

  const handleLogTime = async () => {
    setTimerError(null)
    if (elapsed === 0) {
      setTimerError(t.timesheet.startFirst)
      return
    }

    try {
      stopTimer()
      await api.post('/api/time-entries', {
        durationSeconds: elapsed,
        description: timerDescription || null,
        projectId: timerProjectId ? parseInt(timerProjectId) : null,
        date: new Date().toISOString().split('T')[0]
      })
      setElapsed(0)
      setTimerDescription('')
      setTimerProjectId('')
      await fetchEntries()
    } catch (err) {
      setTimerError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/time-entries/${id}`)
      setConfirmDeleteId(null)
      await fetchEntries()
    } catch (err) {
      setConfirmDeleteId(null)
      setError(err.message)
    }
  }

  const totalSeconds = entries.reduce((sum, e) => sum + e.durationSeconds, 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-amber-600 text-white rounded-lg p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.timesheet.title}</h1>
          <p className="text-sm text-gray-400">{t.timesheet.subtitle}</p>
        </div>
      </div>

      {/* Timer Card */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.timesheet.timer}</h3>

        {/* Timer display */}
        <div className="text-center mb-6">
          <span className="text-6xl font-mono font-bold text-gray-800 tracking-widest">
            {formatDuration(elapsed)}
          </span>
        </div>

        {/* Timer controls */}
        <div className="flex justify-center gap-3 mb-6">
          {!running ? (
            <button
              onClick={startTimer}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {t.timesheet.start}
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="flex items-center gap-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              {t.timesheet.pause}
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            {t.timesheet.reset}
          </button>
        </div>

        {/* Project + description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.project}</label>
            <select
              value={timerProjectId}
              onChange={e => setTimerProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">{t.timesheet.noProject}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.note}</label>
            <input
              type="text"
              value={timerDescription}
              onChange={e => setTimerDescription(e.target.value)}
              placeholder="e.g. 3D model opgemaakt"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {timerError && (
          <p className="text-red-600 text-sm mb-3">{timerError}</p>
        )}

        <button
          onClick={handleLogTime}
          className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
        >
          {t.timesheet.logTime}
        </button>
      </div>

      {/* Summary */}
      {entries.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 mb-6 flex items-center justify-between">
          <span className="text-amber-800 font-medium">
            {isAdmin() ? t.timesheet.totalAll : t.timesheet.totalMe}
          </span>
          <span className="text-amber-900 font-bold text-lg font-mono">{formatDuration(totalSeconds)}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <svg className="animate-spin h-10 w-10 text-amber-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">{t.timesheet.noEntries}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colDate}</th>
                {isAdmin() && <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colUser}</th>}
                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colProject}</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colNote}</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">{t.timesheet.colDuration}</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-700 whitespace-nowrap">
                    {new Date(entry.date).toLocaleDateString('en-GB')}
                  </td>
                  {isAdmin() && (
                    <td className="px-5 py-4 text-gray-700">{entry.userFullName || entry.userName}</td>
                  )}
                  <td className="px-5 py-4 text-gray-700">
                    {entry.projectName ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">{entry.projectName}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{entry.description || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4 font-mono font-semibold text-gray-800">{formatDuration(entry.durationSeconds)}</td>
                  <td className="px-5 py-4">
                    {confirmDeleteId === entry.id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-gray-600">{t.timesheet.deleteConfirm}</span>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                        >
                          {t.timesheet.deleteConfirmBtn || 'Delete'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium border border-gray-300 transition-colors"
                        >
                          {t.timesheet.cancel}
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditEntry(entry)}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(entry.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editEntry && (
        <EditEntryModal
          entry={editEntry}
          projects={projects}
          onClose={() => setEditEntry(null)}
          onSaved={() => { setEditEntry(null); fetchEntries() }}
        />
      )}
    </div>
  )
}

function EditEntryModal({ entry, projects, onClose, onSaved }) {
  const [form, setForm] = useState({
    durationSeconds: entry.durationSeconds,
    description: entry.description || '',
    date: entry.date,
    projectId: entry.projectId ? String(entry.projectId) : ''
  })
  const { t } = useLang()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Editable hours/minutes/seconds split from durationSeconds
  const [hours, setHours] = useState(Math.floor(entry.durationSeconds / 3600))
  const [minutes, setMinutes] = useState(Math.floor((entry.durationSeconds % 3600) / 60))
  const [seconds, setSeconds] = useState(entry.durationSeconds % 60)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const totalSecs = hours * 3600 + minutes * 60 + seconds
    if (totalSecs <= 0) {
      setError(t.timesheet.durationError)
      return
    }
    try {
      setLoading(true)
      await api.put(`/api/time-entries/${entry.id}`, {
        durationSeconds: totalSecs,
        description: form.description || null,
        date: form.date,
        projectId: form.projectId ? parseInt(form.projectId) : null
      })
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{t.timesheet.editTitle}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.duration}</label>
            <div className="flex gap-2 items-center">
              <input type="number" min="0" value={hours} onChange={e => setHours(+e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <span className="text-gray-500 font-medium">h</span>
              <input type="number" min="0" max="59" value={minutes} onChange={e => setMinutes(+e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <span className="text-gray-500 font-medium">m</span>
              <input type="number" min="0" max="59" value={seconds} onChange={e => setSeconds(+e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <span className="text-gray-500 font-medium">s</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.date}</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.projectOpt}</label>
            <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="">{t.timesheet.noProject}</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.timesheet.noteLabel}</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. 3D model opgemaakt"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg disabled:bg-gray-400 transition-colors">
              {loading ? t.timesheet.saving : t.timesheet.save}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">
              {t.timesheet.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Timesheet
