import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

const STATUS_COLORS = {
  DRAFT:    'bg-gray-100 text-gray-600',
  SENT:     'bg-blue-100 text-blue-700',
  PENDING:  'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const STATUS_LABELS = {
  DRAFT: 'Draft', SENT: 'Sent', PENDING: 'Pending', ACCEPTED: 'Accepted', REJECTED: 'Rejected'
}

function isDeadlineSoon(deadline) {
  if (!deadline) return false
  const days = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
  return days >= 0 && days <= 7
}

function isDeadlinePassed(deadline) {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export default function Offertes() {
  const navigate = useNavigate()
  const [offertes, setOffertes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchOffertes()
  }, [])

  const fetchOffertes = async () => {
    try {
      const data = await api.get('/api/offertes')
      setOffertes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = offertes.filter(o => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter
    const matchesSearch = search === '' ||
      o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      o.projectDescription?.toLowerCase().includes(search.toLowerCase()) ||
      o.offerteNumber?.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPending = offertes
    .filter(o => o.status === 'PENDING')
    .reduce((sum, o) => sum + (o.totalInclVat || 0), 0)

  const acceptedThisMonth = offertes.filter(o => {
    if (o.status !== 'ACCEPTED') return false
    const d = new Date(o.updatedAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
  if (error) return <div className="flex items-center justify-center h-64 text-red-500">{error}</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offertes</h1>
          <p className="text-sm text-gray-500 mt-1">{offertes.length} total</p>
        </div>
        <button
          onClick={() => navigate('/offertes/new')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
        >
          + New Offerte
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Offertes</p>
          <p className="text-2xl font-bold text-gray-900">{offertes.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Value Pending</p>
          <p className="text-2xl font-bold text-yellow-600">€{totalPending.toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Accepted This Month</p>
          <p className="text-2xl font-bold text-green-600">{acceptedThisMonth}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by client, project or number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">All Statuses</option>
          {Object.keys(STATUS_LABELS).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Number</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Project</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Deadline</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Total (incl. VAT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">No offertes found</td>
              </tr>
            )}
            {filtered.map((o, index) => {
              const deadlineSoon = isDeadlineSoon(o.submissionDeadline)
              const deadlinePassed = isDeadlinePassed(o.submissionDeadline)
              return (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/offertes/${o.id}`)}
                  className="hover:bg-amber-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400 font-mono">{index + 1}</td>
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{o.offerteNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{o.clientName}</td>
                  <td className="px-4 py-3 text-gray-700">{o.projectDescription}</td>
                  <td className="px-4 py-3 text-gray-500">{o.date}</td>
                  <td className="px-4 py-3">
                    {o.submissionDeadline ? (
                      <span className={`font-medium ${deadlinePassed ? 'text-red-600' : deadlineSoon ? 'text-orange-500' : 'text-gray-500'}`}>
                        {deadlinePassed ? '⚠ ' : deadlineSoon ? '⏰ ' : ''}{o.submissionDeadline}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    €{Number(o.totalInclVat || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
