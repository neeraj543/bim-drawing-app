import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
    </div>
  )
}

function MoneyRow({ label, value, highlight }) {
  return (
    <div className={`flex justify-between py-2 ${highlight ? 'font-semibold text-gray-900 border-t border-gray-200 mt-2 pt-3' : 'text-gray-600'}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm font-mono">€{Number(value || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</span>
    </div>
  )
}

export default function OfferteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [offerte, setOfferte] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOfferte()
  }, [id])

  const fetchOfferte = async () => {
    try {
      const data = await api.get(`/api/offertes/${id}`)
      setOfferte(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      const updated = await api.patch(`/api/offertes/${id}/status?status=${newStatus}`)
      setOfferte(updated)
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      const copy = await api.post(`/api/offertes/${id}/duplicate`)
      navigate(`/offertes/${copy.id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this offerte?')) return
    try {
      await api.delete(`/api/offertes/${id}`)
      navigate('/offertes')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/offertes/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Failed to generate PDF')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
  if (error) return <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
  if (!offerte) return null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => navigate('/offertes')} className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
            ← Back to Offertes
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{offerte.offerteNumber}</h1>
          <p className="text-gray-500 mt-1">{offerte.projectDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[offerte.status]}`}>
            {STATUS_LABELS[offerte.status]}
          </span>
          <select
            onChange={e => handleStatusChange(e.target.value)}
            disabled={updatingStatus}
            value={offerte.status}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {Object.keys(STATUS_LABELS).map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <button
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={() => navigate(`/offertes/${id}/edit`)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDuplicate}
            className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* General Info */}
          <Section title="General Info">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Offerte Number" value={offerte.offerteNumber} />
              <Field label="Date" value={offerte.date} />
              <Field label="Prepared By" value={offerte.preparedBy} />
              <Field label="Submission Deadline" value={offerte.submissionDeadline} />
              <Field label="Finish Grade" value={offerte.finishGrade} />
              <Field label="Project Type" value={offerte.projectType} />
            </div>
          </Section>

          {/* Client */}
          <Section title="Client">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" value={offerte.clientName} />
              <Field label="VAT Number" value={offerte.clientVatNumber} />
              <Field label="Address" value={[offerte.clientStreet, offerte.clientStreetNumber, offerte.clientPostcode, offerte.clientCity].filter(Boolean).join(' ')} />
              <Field label="Construction Site" value={offerte.siteAddress} />
            </div>
          </Section>

          {/* Building Details */}
          <Section title="Building Details">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Units" value={offerte.numberOfUnits} />
              <Field label="Dimensions (L×B)" value={offerte.buildingDimensions} />
              <Field label="Floors" value={offerte.numberOfFloors} />
              <Field label="Roof Type" value={offerte.roofType} />
              <Field label="Roof Pitch" value={offerte.roofPitch} />
              <Field label="Cornice Height" value={offerte.corniceHeight} />
              <Field label="Ridge Height" value={offerte.ridgeHeight} />
            </div>
            {(offerte.ceilingHeightKelder || offerte.ceilingHeightGelijkvloers || offerte.ceilingHeightVerdiep1 || offerte.ceilingHeightZolderverdiep) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">Ceiling Heights</p>
                <div className="grid grid-cols-4 gap-4">
                  <Field label="Kelder" value={offerte.ceilingHeightKelder} />
                  <Field label="Gelijkvloers" value={offerte.ceilingHeightGelijkvloers} />
                  <Field label="Verdiep 1" value={offerte.ceilingHeightVerdiep1} />
                  <Field label="Zolderverdiep" value={offerte.ceilingHeightZolderverdiep} />
                </div>
              </div>
            )}
          </Section>

          {/* Structure */}
          <Section title="Structure">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-2">CLT</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="m²" value={offerte.cltM2} />
                  <Field label="Price/m²" value={offerte.cltPricePerM2 ? `€${offerte.cltPricePerM2}` : null} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">GL Columns</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="m³" value={offerte.glColumnsM3} />
                  <Field label="Price/m³" value={offerte.glColumnsPricePerM3 ? `€${offerte.glColumnsPricePerM3}` : null} />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">GL Beams</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="m³" value={offerte.glBeamsM3} />
                  <Field label="Price/m³" value={offerte.glBeamsPricePerM3 ? `€${offerte.glBeamsPricePerM3}` : null} />
                </div>
              </div>
              {offerte.includeRoostring && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Roostering met Beplating</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="m²" value={offerte.roosteringM2} />
                    <Field label="Price/m²" value={offerte.roosteringPricePerM2 ? `€${offerte.roosteringPricePerM2}` : null} />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Field label="Number of Trucks" value={offerte.numberOfTrucks} />
            </div>
          </Section>

          {offerte.notes && (
            <Section title="Notes">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{offerte.notes}</p>
            </Section>
          )}
        </div>

        {/* Price Summary */}
        <div className="col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Price Summary</h3>
            <MoneyRow label="Structuur (CLT + GL)" value={offerte.structuurTotal} />
            <MoneyRow label="Engineering (5%)" value={offerte.engineeringCost} />
            <MoneyRow label="CNC — CLT" value={offerte.cncCltCost} />
            <MoneyRow label="CNC — GL" value={offerte.cncGlCost} />
            <MoneyRow label="Accessoires (12%)" value={offerte.accessoiresCost} />
            {offerte.includeRoostring && <MoneyRow label="Roostering" value={offerte.roosteringTotal} />}
            <MoneyRow label={`Transport (${offerte.numberOfTrucks || 0} trucks)`} value={offerte.transportCost} />
            <MoneyRow label="Montage (22%)" value={offerte.montageCost} />
            <MoneyRow label="Subtotal excl. VAT" value={offerte.subtotalExclVat} highlight />
            <MoneyRow label="VAT (21%)" value={offerte.vat} />
            <MoneyRow label="Total incl. VAT" value={offerte.totalInclVat} highlight />
          </div>
        </div>
      </div>
    </div>
  )
}
