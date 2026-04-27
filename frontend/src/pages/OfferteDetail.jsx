import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useLang } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  DRAFT:    'bg-gray-100 text-gray-600',
  SENT:     'bg-blue-100 text-blue-700',
  PENDING:  'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
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
  const { lang, toggle, t } = useLang()
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
    if (!confirm(t.deleteConfirm)) return
    try {
      await api.delete(`/api/offertes/${id}`)
      navigate('/offertes')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      const blob = await api.download(`/api/offertes/${id}/pdf`)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `offerte-${offerte.offerteNumber.replace('/', '-')}.pdf`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } catch (err) {
      alert(err.message)
    }
  }

  const handlePreviewPdf = async () => {
    try {
      const blob = await api.download(`/api/offertes/${id}/pdf`)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">{t.loading}</div>
  if (error) return <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
  if (!offerte) return null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        {/* Row 1: back + lang toggle */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/offertes')} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
            {t.back}
          </button>
          <button onClick={toggle} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            {lang === 'nl' ? 'NL' : 'EN'}
          </button>
        </div>

        {/* Row 2: title + status */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{offerte.offerteNumber}</h1>
            <p className="text-gray-500 mt-1">{offerte.projectDescription}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[offerte.status]}`}>
              {t.status[offerte.status]}
            </span>
            <select
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              value={offerte.status}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {Object.keys(t.status).map(s => (
                <option key={s} value={s}>{t.status[s]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: action buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <button onClick={handlePreviewPdf} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            {t.previewPdf}
          </button>
          <button onClick={handleDownloadPdf} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
            {t.downloadPdf}
          </button>
          <button onClick={() => navigate(`/offertes/${id}/edit`)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
            {t.edit}
          </button>
          <button onClick={handleDuplicate} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            {t.duplicate}
          </button>
          <div className="ml-auto">
            <button onClick={handleDelete} className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition-colors">
              {t.delete}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* General Info */}
          <Section title={t.generalInfo}>
            <div className="grid grid-cols-3 gap-4">
              <Field label={t.offerteNumber} value={offerte.offerteNumber} />
              <Field label={t.date} value={offerte.date} />
              <Field label={t.preparedBy} value={offerte.preparedBy} />
              <Field label={t.submissionDeadline} value={offerte.submissionDeadline} />
              <Field label={t.validUntil} value={offerte.validUntil} />
              <Field label={t.delivery} value={offerte.deliveryQuarter} />
            </div>
          </Section>

          {/* Client */}
          <Section title={t.clientSection}>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t.clientName} value={offerte.clientName} />
              <Field label={t.vatNumber} value={offerte.clientVatNumber} />
              <Field label={t.address} value={[offerte.clientStreet, offerte.clientStreetNumber, offerte.clientPostcode, offerte.clientCity].filter(Boolean).join(' ')} />
              <Field label={t.constructionSite} value={offerte.siteAddress} />
            </div>
          </Section>

          {/* Structure */}
          <Section title={t.structureSection}>
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
              <Field label={t.numberOfTrucks} value={offerte.numberOfTrucks} />
            </div>
          </Section>

          {/* Extra line items */}
          {offerte.lineItems && offerte.lineItems.length > 0 && (
            <Section title={t.lineItemsSection}>
              <div className="grid gap-1 mb-2 text-xs text-gray-400" style={{ gridTemplateColumns: '1fr 60px 80px 100px 90px' }}>
                <span>{t.lineItemDescLabel}</span>
                <span className="text-right">{t.lineItemQtyLabel}</span>
                <span>{t.lineItemUnitLabel}</span>
                <span className="text-right">{t.lineItemPriceLabel}</span>
                <span className="text-right">Total</span>
              </div>
              {offerte.lineItems.map((item, idx) => (
                <div key={idx} className="grid gap-3 py-2 border-b border-gray-50 last:border-0 text-sm" style={{ gridTemplateColumns: '1fr 60px 80px 100px 90px' }}>
                  <span className="text-gray-800">{item.description || '—'}</span>
                  <span className="text-gray-500 text-right">{item.quantity}</span>
                  <span className="text-gray-500">{item.unit}</span>
                  <span className="text-gray-500 text-right">€{Number(item.pricePerUnit || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</span>
                  <span className="text-gray-800 text-right font-mono">€{((Number(item.quantity) || 0) * (Number(item.pricePerUnit) || 0)).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </Section>
          )}

          {offerte.notes && (
            <Section title={t.notesSection}>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{offerte.notes}</p>
            </Section>
          )}
        </div>

        {/* Price Summary */}
        <div className="col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{t.priceSummary}</h3>
            <MoneyRow label="Structuur (CLT + GL)" value={offerte.structuurTotal} />
            <MoneyRow label={`Engineering (${offerte.engineeringRatePct ?? 5}%)`} value={offerte.engineeringCost} />
            <MoneyRow label={`CNC — CLT (€${offerte.cncCltRatePerM2 ?? 11}/m²)`} value={offerte.cncCltCost} />
            <MoneyRow label={`CNC — GL (€${offerte.cncGlRatePerM3 ?? 260}/m³)`} value={offerte.cncGlCost} />
            <MoneyRow label={`Accessoires (${offerte.accessoiresRatePct ?? 12}%)`} value={offerte.accessoiresCost} />
            {offerte.includeRoostring && <MoneyRow label="Roostering" value={offerte.roosteringTotal} />}
            <MoneyRow label={t.trucks(offerte.numberOfTrucks || 0)} value={offerte.transportCost} />
            <MoneyRow label={`Montage (${offerte.montageRatePct ?? 22}%)`} value={offerte.montageCost} />
            {offerte.lineItems && offerte.lineItems.length > 0 && (
              <MoneyRow label={t.extraLineItems} value={offerte.lineItemsTotal} />
            )}
            <MoneyRow label={t.subtotalExclVat} value={offerte.subtotalExclVat} highlight />
            <MoneyRow label={t.vat} value={offerte.vat} />
            <MoneyRow label={t.totalInclVat} value={offerte.totalInclVat} highlight />
          </div>
        </div>
      </div>
    </div>
  )
}
