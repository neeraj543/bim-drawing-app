import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LanguageContext'

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

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useLang()
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
    ]).then(([o, p, taskList]) => {
      setOffertes(o)
      setProjects(p)
      setTasks(
        taskList.filter(task => task.status !== 'DONE')
          .sort((a, b) => {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate) - new Date(b.dueDate)
          })
          .slice(0, 6)
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
    .slice(0, 5)

  const todayStr = now.toLocaleDateString('en-BE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const fmt = v => `€${Number(v).toLocaleString('nl-BE', { maximumFractionDigits: 0 })}`

  const hour = new Date().getHours()
  const greet = hour < 12 ? t.dash.greetMorning : hour < 18 ? t.dash.greetAfternoon : t.dash.greetEvening

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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="text-2xl font-bold text-gray-900">{greet}, {user?.fullName || user?.username}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{todayStr}</p>
          </div>
          <button
            onClick={() => navigate('/offertes/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.dash.newOfferte}
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">{t.dash.openPipeline}</p>
                <p className="text-3xl font-bold text-gray-900">{fmt(pipelineValue)}</p>
                <p className="text-xs text-gray-400 mt-1.5">{t.dash.sentPending}</p>
              </div>
              <div className="bg-amber-100 rounded-xl p-2.5">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">{t.dash.acceptedMonth}</p>
                <p className="text-3xl font-bold text-gray-900">{acceptedThisMonth.length}</p>
                <p className="text-xs text-gray-400 mt-1.5">{t.dash.offertesWon(acceptedThisMonth.length)}</p>
              </div>
              <div className="bg-green-100 rounded-xl p-2.5">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/projects')}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm cursor-pointer hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">{t.dash.activeProjects}</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-xs text-amber-600 mt-1.5 font-semibold">{t.dash.viewAll}</p>
              </div>
              <div className="bg-blue-100 rounded-xl p-2.5">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-6">

          {/* Recent offertes */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm font-semibold text-gray-700">{t.dash.recentOffertes}</p>
              </div>
              <button
                onClick={() => navigate('/offertes')}
                className="text-xs text-amber-600 hover:text-amber-800 font-semibold transition-colors"
              >
                {t.dash.viewAll}
              </button>
            </div>
            {recentOffertes.length === 0 ? (
              <div className="text-center py-14 text-gray-400 text-sm">{t.dash.noOffertes}</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOffertes.map(o => (
                  <div
                    key={o.id}
                    onClick={() => navigate(`/offertes/${o.id}`)}
                    className="flex items-center justify-between px-5 py-4 hover:bg-amber-50 cursor-pointer transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-gray-400">{o.offerteNumber}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status]}`} />
                          {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate">{o.clientName}</p>
                    </div>
                    <div className="shrink-0 ml-4 text-right">
                      <p className="text-sm font-bold text-gray-900">{fmt(o.totalInclVat || 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming tasks */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm font-semibold text-gray-700">{t.dash.upcomingTasks}</p>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs text-amber-600 hover:text-amber-800 font-semibold transition-colors"
              >
                {t.dash.viewAll}
              </button>
            </div>
            {tasks.length === 0 ? (
              <div className="text-center py-14 text-gray-400 text-sm">{t.dash.noTasks}</div>
            ) : (
              <div className="divide-y divide-gray-100">
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
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                        {task.dueDate && (
                          <p className={`text-xs mt-0.5 font-medium ${
                            isOverdue ? 'text-red-500' : isSoon ? 'text-orange-500' : 'text-gray-400'
                          }`}>
                            {isOverdue ? t.dash.daysOverdue(Math.abs(days)) : days === 0 ? t.dash.dueToday : t.dash.dueIn(days)}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs shrink-0 ml-4 font-semibold px-2.5 py-1 rounded-full ${
                        task.priority === 'HIGH'   ? 'bg-red-100 text-red-700' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                     'bg-green-100 text-green-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}