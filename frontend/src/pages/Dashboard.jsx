import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

const STATUS_COLORS = {
  DRAFT:    'bg-gray-100 text-gray-600',
  SENT:     'bg-blue-100 text-blue-700',
  PENDING:  'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
}

const STATUS_DOT = {
  DRAFT:    'bg-gray-400',
  SENT:     'bg-blue-500',
  PENDING:  'bg-yellow-500',
  ACCEPTED: 'bg-green-500',
  REJECTED: 'bg-red-500',
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function StatCard({ label, value, sub, color = 'text-gray-900', icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {icon && <div className="text-gray-200 mt-0.5">{icon}</div>}
      </div>
    </div>
  )
}


export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [offertes, setOffertes] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const now = new Date()

  useEffect(() => {
    Promise.all([
      api.get('/api/offertes'),
      api.get('/api/projects'),
      api.get('/api/tasks'),
    ]).then(([o, p, t]) => {
      setOffertes(o)
      setProjects(p)
      setTasks(
        t.filter(task => task.status !== 'DONE')
          .sort((a, b) => {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate) - new Date(b.dueDate)
          })
          .slice(0, 5)
      )
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const pipelineValue = offertes
    .filter(o => ['SENT', 'PENDING'].includes(o.status))
    .reduce((s, o) => s + (o.totalInclVat || 0), 0)

  const acceptedThisMonth = offertes.filter(o => {
    if (o.status !== 'ACCEPTED') return false
    const d = new Date(o.updatedAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const recentOffertes = [...offertes]
    .sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date))
    .slice(0, 3)

  const urgentCount = tasks.filter(t => {
    if (!t.dueDate) return false
    const days = (new Date(t.dueDate) - now) / (1000 * 60 * 60 * 24)
    return days <= 7
  }).length

  const todayStr = now.toLocaleDateString('en-BE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const fmt = v => `€${Number(v).toLocaleString('nl-BE', { maximumFractionDigits: 0 })}`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="animate-spin h-8 w-8 text-amber-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* Welcome banner */}
      <div className="mb-8 bg-linear-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-0.5">{greeting()}, {user?.fullName || user?.username}</h1>
            <p className="text-amber-100 text-sm">{todayStr}</p>
          </div>
          {urgentCount > 0 && (
            <button
              onClick={() => navigate('/tasks')}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-right shrink-0"
            >
              <p className="text-xs text-amber-100 uppercase tracking-wide font-medium">Heads up</p>
              <p className="text-base font-bold">{urgentCount} task{urgentCount !== 1 ? 's' : ''} due this week</p>
            </button>
          )}
        </div>
      </div>

      {/* Offerte stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Open pipeline"
          value={fmt(pipelineValue)}
          sub="SENT + PENDING"
          color="text-yellow-600"
        />
        <StatCard
          label="Accepted this month"
          value={acceptedThisMonth.length}
          color="text-green-600"
        />
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Recent offertes — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Recent offertes</p>
            <button
              onClick={() => navigate('/offertes')}
              className="text-xs text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 transition-colors"
            >
              View all
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {recentOffertes.length === 0 ? (
              <div className="text-center py-14 text-gray-400 text-sm">
                <div className="text-3xl mb-2">📋</div>
                No offertes yet
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Number</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Client</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOffertes.map(o => (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/offertes/${o.id}`)}
                      className="hover:bg-amber-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{o.offerteNumber}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{o.clientName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status]}`} />
                          {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">
                        {fmt(o.totalInclVat || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right sidebar — 1/3 */}
        <div className="flex flex-col gap-4">

          {/* Project count */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Projects</p>
            <div
              onClick={() => navigate('/projects')}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-amber-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 rounded-xl p-3">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
                  <p className="text-sm text-gray-400">active project{projects.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-3 font-medium">Open projects →</p>
            </div>
          </div>

          {/* Upcoming tasks */}
          {tasks.length > 0 ? (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Upcoming tasks</p>
                <button
                  onClick={() => navigate('/tasks')}
                  className="text-xs text-amber-600 hover:text-amber-800 font-medium transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                {tasks.map(task => {
                  const days = task.dueDate
                    ? Math.ceil((new Date(task.dueDate) - now) / (1000 * 60 * 60 * 24))
                    : null
                  const isOverdue = days !== null && days < 0
                  const isSoon = days !== null && days >= 0 && days <= 3
                  return (
                    <div
                      key={task.id}
                      onClick={() => navigate('/tasks')}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-gray-800 leading-tight truncate">{task.title}</p>
                        <span className={`text-xs shrink-0 font-medium px-2 py-0.5 rounded-full ${
                          task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.dueDate && (
                        <p className={`text-xs mt-0.5 font-medium ${
                          isOverdue ? 'text-red-500' : isSoon ? 'text-orange-500' : 'text-gray-400'
                        }`}>
                          {isOverdue
                            ? `${Math.abs(days)}d overdue`
                            : days === 0 ? 'Due today'
                            : `Due in ${days}d`}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Upcoming tasks</p>
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                No open tasks
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quick actions</p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/offertes/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Offerte
        </button>
        <button
          onClick={() => navigate('/offertes')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          All Offertes
        </button>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Projects
        </button>
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Tasks
        </button>
      </div>
    </div>
  )
}