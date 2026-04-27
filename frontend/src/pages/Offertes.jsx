import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useLang } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  DRAFT:    'bg-gray-100 text-gray-600 hover:bg-gray-200',
  SENT:     'bg-blue-100 text-blue-700 hover:bg-blue-200',
  PENDING:  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  ACCEPTED: 'bg-green-100 text-green-700 hover:bg-green-200',
  REJECTED: 'bg-red-100 text-red-600 hover:bg-red-200',
}

const STATUS_DOT = {
  DRAFT:    'bg-gray-400',
  SENT:     'bg-blue-500',
  PENDING:  'bg-yellow-500',
  ACCEPTED: 'bg-green-500',
  REJECTED: 'bg-red-500',
}

function fmt(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function deadlineState(deadline) {
  if (!deadline) return null
  const days = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
  if (days < 0) return 'passed'
  if (days <= 7) return 'soon'
  return 'ok'
}

function SortIcon({ field, sort }) {
  if (sort.field !== field) return <span className="text-gray-300 ml-1">↕</span>
  return <span className="text-amber-600 ml-1">{sort.dir === 'asc' ? '↑' : '↓'}</span>
}

export default function Offertes() {
  const navigate = useNavigate()
  const { lang, toggle, t } = useLang()
  const [offertes, setOffertes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ field: 'date', dir: 'desc' })
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => { api.get('/api/offertes').then(setOffertes).catch(e => setError(e.message)).finally(() => setLoading(false)) }, [])

  const toggleSort = (field) => setSort(s => ({ field, dir: s.field === field && s.dir === 'desc' ? 'asc' : 'desc' }))

  const statusCounts = offertes.reduce((acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }), {})

  const filtered = offertes
    .filter(o => (statusFilter === 'ALL' || o.status === statusFilter) && (
      search === '' ||
      o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      o.projectDescription?.toLowerCase().includes(search.toLowerCase()) ||
      o.offerteNumber?.toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a, b) => {
      let av = a[sort.field], bv = b[sort.field]
      if (sort.field === 'totalInclVat') { av = Number(av || 0); bv = Number(bv || 0) }
      if (av < bv) return sort.dir === 'asc' ? -1 : 1
      if (av > bv) return sort.dir === 'asc' ? 1 : -1
      return 0
    })

  const totalPending = offertes.filter(o => ['PENDING', 'SENT'].includes(o.status)).reduce((s, o) => s + (o.totalInclVat || 0), 0)
  const acceptedThisMonth = offertes.filter(o => {
    if (o.status !== 'ACCEPTED') return false
    const d = new Date(o.updatedAt), now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const acceptedValue = acceptedThisMonth.reduce((s, o) => s + (o.totalInclVat || 0), 0)
  const filteredTotal = filtered.reduce((s, o) => s + (o.totalInclVat || 0), 0)

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">{t.loading}</div>
  if (error) return <div className="flex items-center justify-center h-64 text-red-500 text-sm">{error}</div>

  const Th = ({ field, children, right }) => (
    <th
      onClick={() => toggleSort(field)}
      className={`px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide cursor-pointer select-none hover:text-gray-800 transition-colors ${right ? 'text-right' : 'text-left'}`}
    >
      {children}<SortIcon field={field} sort={sort} />
    </th>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offertes</h1>
          <p className="text-sm text-gray-400 mt-0.5">{offertes.length} {lang === 'nl' ? 'in totaal' : 'total'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
            {lang === 'nl' ? 'NL' : 'EN'}
          </button>
          <button onClick={() => navigate('/offertes/new')} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
            {t.newOfferte}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{t.totalOffertes}</p>
          <p className="text-2xl font-bold text-gray-900">{offertes.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{t.valuePending}</p>
          <p className="text-2xl font-bold text-yellow-600">€{totalPending.toLocaleString('nl-BE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{t.acceptedThisMonth}</p>
          <p className="text-2xl font-bold text-green-600">{acceptedThisMonth.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{lang === 'nl' ? 'Aanvaard waarde' : 'Accepted Value'}</p>
          <p className="text-2xl font-bold text-green-600">€{acceptedValue.toLocaleString('nl-BE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === 'ALL' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {lang === 'nl' ? 'Alle' : 'All'} ({offertes.length})
          </button>
          {Object.keys(STATUS_COLORS).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${statusFilter === s ? STATUS_COLORS[s].replace('hover:', '') : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
              {t.status[s]} {statusCounts[s] ? `(${statusCounts[s]})` : '(0)'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th field="offerteNumber">{t.colNumber}</Th>
              <Th field="clientName">{t.colClient}</Th>
              <Th field="projectDescription">{t.colProject}</Th>
              <Th field="date">{t.colDate}</Th>
              <Th field="submissionDeadline">{t.colDeadline}</Th>
              <Th field="status">{t.colStatus}</Th>
              <Th field="totalInclVat" right>{t.colTotal}</Th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-400">
                  <div className="text-3xl mb-2">📋</div>
                  <div>{t.noOffertes}</div>
                </td>
              </tr>
            )}
            {filtered.map(o => {
              const ds = deadlineState(o.submissionDeadline)
              return (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/offertes/${o.id}`)}
                  onMouseEnter={() => setHoveredId(o.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="hover:bg-amber-50 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 font-mono font-semibold text-gray-800">{o.offerteNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{o.clientName}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-48 truncate">{o.projectDescription}</td>
                  <td className="px-4 py-3 text-gray-400">{fmt(o.date)}</td>
                  <td className="px-4 py-3">
                    {o.submissionDeadline ? (
                      <span className={`text-xs font-medium ${ds === 'passed' ? 'text-red-600' : ds === 'soon' ? 'text-orange-500' : 'text-gray-400'}`}>
                        {ds === 'passed' ? '⚠ ' : ds === 'soon' ? '⏰ ' : ''}{fmt(o.submissionDeadline)}
                      </span>
                    ) : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status].split(' ').slice(0, 2).join(' ')}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status]}`} />
                      {t.status[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    €{Number(o.totalInclVat || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/offertes/${o.id}/edit`) }}
                      className={`text-gray-300 hover:text-amber-600 transition-colors text-base ${hoveredId === o.id ? 'opacity-100' : 'opacity-0'}`}
                    >
                      ✏
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan={6} className="px-4 py-3 text-xs text-gray-400 font-medium">
                  {filtered.length} {lang === 'nl' ? 'offerte(s) zichtbaar' : 'offerte(s) visible'}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                  €{filteredTotal.toLocaleString('nl-BE', { minimumFractionDigits: 2 })}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}