import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { useLang } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  DRAFT:    'bg-gray-100 text-gray-600',
  SENT:     'bg-blue-100 text-blue-700',
  PENDING:  'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-600',
}

const STATUS_ACTIVE = {
  DRAFT:    'bg-gray-700 text-white ring-2 ring-gray-300',
  SENT:     'bg-blue-600 text-white ring-2 ring-blue-200',
  PENDING:  'bg-yellow-500 text-white ring-2 ring-yellow-200',
  ACCEPTED: 'bg-green-600 text-white ring-2 ring-green-200',
  REJECTED: 'bg-red-500 text-white ring-2 ring-red-200',
}

const STATUS_FLOW = ['DRAFT', 'SENT', 'PENDING', 'ACCEPTED']

function fmt(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
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
      <p className="text-sm text-gray-800 font-medium">{value || <span className="text-gray-300">â€”</span>}</p>
    </div>
  )
}

function MoneyRow({ label, value, highlight, subTotal }) {
  const pct = subTotal && value ? Math.min(100, (Number(value) / Number(subTotal)) * 100) : 0
  return (
    <div className={`py-2 ${highlight ? 'border-t border-gray-200 mt-2 pt-3' : ''}`}>
      <div className={`flex justify-between ${highlight ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
        <span className="text-sm">{label}</span>
        <span className="text-sm font-mono">â‚¬{Number(value || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</span>
      </div>
      {!highlight && pct > 0 && (
        <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-300 rounded-full" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}

export default function OfferteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const [offerte, setOfferte] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => { fetchOfferte() }, [id])

  const fetchOfferte = async () => {
    try { setOfferte(await api.get(`/api/offertes/${id}`)) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleStatusChange = async (newStatus) => {
    if (newStatus === offerte.status || updatingStatus) return
    setUpdatingStatus(true)
    try { setOfferte(await api.patch(`/api/offertes/${id}/status?status=${newStatus}`)) }
    catch (err) { alert(err.message) }
    finally { setUpdatingStatus(false) }
  }

  const handleDuplicate = async () => {
    try { const copy = await api.post(`/api/offertes/${id}/duplicate`); navigate(`/offertes/${copy.id}`) }
    catch (err) { alert(err.message) }
  }

  const handleDelete = async () => {
    if (!confirm(t.deleteConfirm)) return
    try { await api.delete(`/api/offertes/${id}`); navigate('/offertes') }
    catch (err) { alert(err.message) }
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
    } catch (err) { alert(err.message) }
  }

  const handlePreviewPdf = async () => {
    try {
      const blob = await api.download(`/api/offertes/${id}/pdf`)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">{t.loading}</div>
  if (error)   return <div className="flex items-center justify-center h-64 text-red-500 text-sm">{error}</div>
  if (!offerte) return null

  const structuurItems = (offerte.lineItems || []).filter(i => i.section === 'STRUCTUUR')
  const extraItems     = (offerte.lineItems || []).filter(i => i.section !== 'STRUCTUUR')
  const clientAddress  = [offerte.clientStreet, offerte.clientStreetNumber].filter(Boolean).join(' ')
  const clientCity     = [offerte.clientPostcode, offerte.clientCity].filter(Boolean).join(' ')
  const isRejected     = offerte.status === 'REJECTED'

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/offertes')} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
            {t.back}
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{offerte.offerteNumber}</h1>
              <p className="text-gray-500 mt-0.5">{offerte.projectDescription}</p>
              {offerte.clientName && <p className="text-sm text-gray-400 mt-1">{offerte.clientName}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-gray-900">â‚¬{Number(offerte.totalInclVat || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.totalInclVat}</p>
            </div>
          </div>

          {/* Status stepper */}
          <div className="flex items-center gap-1 mb-5">
            {STATUS_FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <button
                  onClick={() => handleStatusChange(s)}
                  disabled={updatingStatus}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${offerte.status === s ? STATUS_ACTIVE[s] : STATUS_COLORS[s] + ' opacity-60 hover:opacity-100'}`}
                >
                  {t.status[s]}
                </button>
                {i < STATUS_FLOW.length - 1 && <span className="text-gray-300 text-xs">â†’</span>}
              </div>
            ))}
            <div className="ml-2">
              <button
                onClick={() => handleStatusChange('REJECTED')}
                disabled={updatingStatus}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isRejected ? STATUS_ACTIVE.REJECTED : 'bg-red-50 text-red-400 hover:bg-red-100'}`}
              >
                {t.status.REJECTED}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <button onClick={handlePreviewPdf} className="px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
              {t.previewPdf}
            </button>
            <button onClick={handleDownloadPdf} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              {t.downloadPdf}
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button onClick={() => navigate(`/offertes/${id}/edit`)} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
              {t.edit}
            </button>
            <button onClick={handleDuplicate} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              {t.duplicate}
            </button>
            <div className="ml-auto">
              <button onClick={handleDelete} className="px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">

          {/* General Info */}
          <Section title={t.generalInfo}>
            <div className="grid grid-cols-3 gap-4">
              <Field label={t.offerteNumber} value={offerte.offerteNumber} />
              <Field label={t.date} value={fmt(offerte.date)} />
              <Field label={t.preparedBy} value={offerte.preparedBy} />
              <Field label={t.submissionDeadline} value={fmt(offerte.submissionDeadline)} />
              <Field label={t.validUntil} value={fmt(offerte.validUntil)} />
              <Field label={t.delivery} value={offerte.deliveryQuarter} />
            </div>
          </Section>

          {/* Client */}
          <Section title={t.clientSection}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{t.clientName}</p>
                <p className="text-sm font-semibold text-gray-900">{offerte.clientName || <span className="text-gray-300 font-normal">â€”</span>}</p>
                {clientAddress && <p className="text-sm text-gray-600 mt-0.5">{clientAddress}</p>}
                {clientCity    && <p className="text-sm text-gray-600">{clientCity}</p>}
              </div>
              <div className="space-y-3">
                <Field label={t.vatNumber} value={offerte.clientVatNumber} />
                <Field label={t.constructionSite} value={offerte.siteAddress} />
              </div>
            </div>
          </Section>

          {/* Structure */}
          <Section title={t.structureSection}>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 mb-2">CLT</p>
                <p className="text-sm font-semibold text-gray-800">{offerte.cltM2 ? `${offerte.cltM2} mÂ²` : 'â€”'}</p>
                <p className="text-xs text-gray-400">{offerte.cltPricePerM2 ? `â‚¬${offerte.cltPricePerM2}/mÂ²` : ''}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 mb-2">GL Columns</p>
                <p className="text-sm font-semibold text-gray-800">{offerte.glColumnsM3 ? `${offerte.glColumnsM3} mÂ³` : 'â€”'}</p>
                <p className="text-xs text-gray-400">{offerte.glColumnsPricePerM3 ? `â‚¬${offerte.glColumnsPricePerM3}/mÂ³` : ''}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-400 mb-2">GL Beams</p>
                <p className="text-sm font-semibold text-gray-800">{offerte.glBeamsM3 ? `${offerte.glBeamsM3} mÂ³` : 'â€”'}</p>
                <p className="text-xs text-gray-400">{offerte.glBeamsPricePerM3 ? `â‚¬${offerte.glBeamsPricePerM3}/mÂ³` : ''}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Field label={t.numberOfTrucks} value={offerte.numberOfTrucks} />
            </div>

            {structuurItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-2">{t.structuurLineItemsSection}</p>
                <LineItemTable items={structuurItems} t={t} />
              </div>
            )}
          </Section>

          {/* Extra line items */}
          {extraItems.length > 0 && (
            <Section title={t.lineItemsSection}>
              <LineItemTable items={extraItems} t={t} />
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
            <MoneyRow label="Structuur (CLT + GL)" value={offerte.structuurTotal} subTotal={offerte.subtotalExclVat} />
            <MoneyRow label={`Engineering (${offerte.engineeringRatePct ?? 5}%)`} value={offerte.engineeringCost} subTotal={offerte.subtotalExclVat} />
            <MoneyRow label={`CNC â€” CLT (â‚¬${offerte.cncCltRatePerM2 ?? 11}/mÂ²)`} value={offerte.cncCltCost} subTotal={offerte.subtotalExclVat} />
            <MoneyRow label={`CNC â€” GL (â‚¬${offerte.cncGlRatePerM3 ?? 260}/mÂ³)`} value={offerte.cncGlCost} subTotal={offerte.subtotalExclVat} />
            <MoneyRow label={`Accessoires (${offerte.accessoiresRatePct ?? 12}%)`} value={offerte.accessoiresCost} subTotal={offerte.subtotalExclVat} />
            <MoneyRow label={t.trucks(offerte.numberOfTrucks || 0)} value={offerte.transportCost} subTotal={offerte.subtotalExclVat} />
            <MoneyRow label={`Montage (${offerte.montageRatePct ?? 22}%)`} value={offerte.montageCost} subTotal={offerte.subtotalExclVat} />
            {extraItems.length > 0 && <MoneyRow label={t.extraLineItems} value={offerte.lineItemsTotal} subTotal={offerte.subtotalExclVat} />}
            <MoneyRow label={t.subtotalExclVat} value={offerte.subtotalExclVat} highlight />
            <MoneyRow label={t.vat} value={offerte.vat} />
            <div className="mt-3 pt-3 border-t-2 border-gray-900">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">{t.totalInclVat}</span>
                <span className="text-xl font-bold text-gray-900 font-mono">â‚¬{Number(offerte.totalInclVat || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LineItemTable({ items, t }) {
  return (
    <div>
      <div className="grid gap-2 mb-1 text-xs text-gray-400" style={{ gridTemplateColumns: '1fr 60px 80px 100px 90px' }}>
        <span>{t.lineItemDescLabel}</span>
        <span className="text-right">{t.lineItemQtyLabel}</span>
        <span>{t.lineItemUnitLabel}</span>
        <span className="text-right">{t.lineItemPriceLabel}</span>
        <span className="text-right">Total</span>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="grid gap-3 py-2 border-b border-gray-50 last:border-0 text-sm" style={{ gridTemplateColumns: '1fr 60px 80px 100px 90px' }}>
          <span className="text-gray-800">{item.description || 'â€”'}</span>
          <span className="text-gray-500 text-right">{item.quantity}</span>
          <span className="text-gray-500">{item.unit}</span>
          <span className="text-gray-500 text-right font-mono">â‚¬{Number(item.pricePerUnit || 0).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</span>
          <span className="text-gray-800 text-right font-mono">â‚¬{((Number(item.quantity) || 0) * (Number(item.pricePerUnit) || 0)).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}</span>
        </div>
      ))}
    </div>
  )
}