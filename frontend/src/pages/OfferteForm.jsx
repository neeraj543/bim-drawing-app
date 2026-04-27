import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'
import { useLang } from '../contexts/LanguageContext'

const EMPTY_FORM = {
  offerteNumber: '',
  date: new Date().toISOString().split('T')[0],
  preparedBy: '',
  projectDescription: '',
  submissionDeadline: '',
  validUntil: '',
  deliveryQuarter: '',
  status: 'DRAFT',
  clientName: '',
  clientStreet: '',
  clientStreetNumber: '',
  clientPostcode: '',
  clientCity: '',
  clientVatNumber: '',
  siteAddress: '',
  cltM2: '',
  cltPricePerM2: '',
  glColumnsM3: '',
  glColumnsPricePerM3: '',
  glBeamsM3: '',
  glBeamsPricePerM3: '',
  includeRoostring: false,
  roosteringM2: '',
  roosteringPricePerM2: '',
  numberOfTrucks: '',
  engineeringRatePct: '',
  cncCltRatePerM2: '',
  cncGlRatePerM3: '',
  accessoiresRatePct: '',
  montageRatePct: '',
  transportRatePerTruck: '',
  engineeringOverride: '',
  cncCltOverride: '',
  cncGlOverride: '',
  accessoiresOverride: '',
  montageOverride: '',
  transportOverride: '',
  notes: '',
}

function FormSection({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"

export default function OfferteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, toggle, t } = useLang()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY_FORM)
  const [lineItems, setLineItems] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/offertes/${id}`)
        .then(data => {
          const { lineItems: items, ...rest } = data
          setForm({
            ...EMPTY_FORM,
            ...Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, v ?? '']))
          })
          setLineItems(items || [])
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const addLineItem = () => setLineItems(prev => [...prev, { description: '', quantity: '', unit: '', pricePerUnit: '' }])
  const removeLineItem = (idx) => setLineItems(prev => prev.filter((_, i) => i !== idx))
  const setLineItem = (idx, field, value) => setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])),
        lineItems: lineItems
          .filter(item => item.description || item.quantity || item.pricePerUnit)
          .map((item, idx) => ({
            description: item.description || null,
            quantity: item.quantity === '' ? null : item.quantity,
            unit: item.unit || null,
            pricePerUnit: item.pricePerUnit === '' ? null : item.pricePerUnit,
            sortOrder: idx,
          }))
      }
      if (isEdit) {
        await api.put(`/api/offertes/${id}`, payload)
        navigate(`/offertes/${id}`)
      } else {
        const created = await api.post('/api/offertes', payload)
        navigate(`/offertes/${created.id}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">{t.loading}</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate('/offertes')} className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? t.editTitle : t.newTitle}</h1>
        </div>
        <button
          onClick={toggle}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {lang === 'nl' ? 'NL' : 'EN'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* General Info */}
        <FormSection title={t.generalInfoSection}>
          <div className="grid grid-cols-3 gap-4">
            <Field label={t.offerteNumberLabel.replace(' *', '')}>
              <input
                className={inputClass}
                value={form.offerteNumber}
                onChange={set('offerteNumber')}
                placeholder={isEdit ? '' : 'Auto (e.g. 26001)'}
              />
            </Field>
            <Field label={t.dateLabel}>
              <input type="date" className={inputClass} value={form.date} onChange={set('date')} required />
            </Field>
            <Field label={t.preparedBy}>
              <input className={inputClass} value={form.preparedBy} onChange={set('preparedBy')} />
            </Field>
            <Field label={t.projectDescLabel}>
              <input className={inputClass} value={form.projectDescription} onChange={set('projectDescription')} required />
            </Field>
            <Field label={t.submissionDeadline}>
              <input type="date" className={inputClass} value={form.submissionDeadline} onChange={set('submissionDeadline')} />
            </Field>
            <Field label={t.validUntil}>
              <input type="date" className={inputClass} value={form.validUntil} onChange={set('validUntil')} />
            </Field>
            <Field label={t.delivery}>
              <input className={inputClass} value={form.deliveryQuarter} onChange={set('deliveryQuarter')} placeholder="Q2 2026" />
            </Field>
            <Field label={t.colStatus}>
              <select className={inputClass} value={form.status} onChange={set('status')}>
                {Object.keys(t.status).map(s => (
                  <option key={s} value={s}>{t.status[s]}</option>
                ))}
              </select>
            </Field>
          </div>
        </FormSection>

        {/* Client */}
        <FormSection title={t.clientSectionForm}>
          <div className="grid grid-cols-3 gap-4">
            <Field label={t.clientNameLabel}>
              <input className={inputClass} value={form.clientName} onChange={set('clientName')} required />
            </Field>
            <Field label={t.vatNumberLabel}>
              <input className={inputClass} value={form.clientVatNumber} onChange={set('clientVatNumber')} />
            </Field>
            <Field label={t.constructionSiteLabel}>
              <input className={inputClass} value={form.siteAddress} onChange={set('siteAddress')} />
            </Field>
            <Field label={t.streetLabel}>
              <input className={inputClass} value={form.clientStreet} onChange={set('clientStreet')} />
            </Field>
            <Field label={t.numberLabel}>
              <input className={inputClass} value={form.clientStreetNumber} onChange={set('clientStreetNumber')} />
            </Field>
            <Field label={t.postcodeLabel}>
              <input className={inputClass} value={form.clientPostcode} onChange={set('clientPostcode')} />
            </Field>
            <Field label={t.cityLabel}>
              <input className={inputClass} value={form.clientCity} onChange={set('clientCity')} />
            </Field>
          </div>
        </FormSection>

        {/* Structure & Pricing */}
        <FormSection title={t.structurePricingSection}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 mb-3 font-medium">CLT</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="m²">
                  <input type="number" step="0.01" className={inputClass} value={form.cltM2} onChange={set('cltM2')} />
                </Field>
                <Field label="Price/m² (€)">
                  <input type="number" step="0.01" className={inputClass} value={form.cltPricePerM2} onChange={set('cltPricePerM2')} />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-3 font-medium">GL Columns</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="m³">
                  <input type="number" step="0.01" className={inputClass} value={form.glColumnsM3} onChange={set('glColumnsM3')} />
                </Field>
                <Field label="Price/m³ (€)">
                  <input type="number" step="0.01" className={inputClass} value={form.glColumnsPricePerM3} onChange={set('glColumnsPricePerM3')} />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-3 font-medium">GL Beams</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="m³">
                  <input type="number" step="0.01" className={inputClass} value={form.glBeamsM3} onChange={set('glBeamsM3')} />
                </Field>
                <Field label="Price/m³ (€)">
                  <input type="number" step="0.01" className={inputClass} value={form.glBeamsPricePerM3} onChange={set('glBeamsPricePerM3')} />
                </Field>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-3 font-medium">Transport</p>
              <Field label={t.numberOfTrucks}>
                <input type="number" className={inputClass} value={form.numberOfTrucks} onChange={set('numberOfTrucks')} />
              </Field>
            </div>
          </div>

          {/* Roostering */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
              <input type="checkbox" checked={form.includeRoostring} onChange={set('includeRoostring')} className="rounded" />
              {t.includeRoostring}
            </label>
            {form.includeRoostring && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <Field label="m²">
                  <input type="number" step="0.01" className={inputClass} value={form.roosteringM2} onChange={set('roosteringM2')} />
                </Field>
                <Field label="Price/m² (€)">
                  <input type="number" step="0.01" className={inputClass} value={form.roosteringPricePerM2} onChange={set('roosteringPricePerM2')} />
                </Field>
              </div>
            )}
          </div>
        </FormSection>

        {/* Additional Line Items */}
        <FormSection title={t.lineItemsSection}>
          {lineItems.length > 0 && (
            <div className="mb-3">
              <div className="grid gap-2 mb-1 text-xs text-gray-400" style={{ gridTemplateColumns: '1fr 80px 90px 120px 90px 32px' }}>
                <span>{t.lineItemDescLabel}</span>
                <span>{t.lineItemQtyLabel}</span>
                <span>{t.lineItemUnitLabel}</span>
                <span>{t.lineItemPriceLabel}</span>
                <span className="text-right">Total</span>
                <span />
              </div>
              {lineItems.map((item, idx) => (
                <div key={idx} className="grid gap-2 mb-2" style={{ gridTemplateColumns: '1fr 80px 90px 120px 90px 32px' }}>
                  <input
                    className={inputClass}
                    value={item.description}
                    onChange={e => setLineItem(idx, 'description', e.target.value)}
                    placeholder="Omschrijving..."
                  />
                  <input
                    type="number" step="0.01"
                    className={inputClass}
                    value={item.quantity}
                    onChange={e => setLineItem(idx, 'quantity', e.target.value)}
                    placeholder="0"
                  />
                  <input
                    className={inputClass}
                    value={item.unit}
                    onChange={e => setLineItem(idx, 'unit', e.target.value)}
                    placeholder="m², pce..."
                  />
                  <input
                    type="number" step="0.01"
                    className={inputClass}
                    value={item.pricePerUnit}
                    onChange={e => setLineItem(idx, 'pricePerUnit', e.target.value)}
                    placeholder="0.00"
                  />
                  <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg text-right font-mono">
                    €{((Number(item.quantity) || 0) * (Number(item.pricePerUnit) || 0)).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLineItem(idx)}
                    className="flex items-center justify-center text-red-400 hover:text-red-600 text-xl font-bold rounded-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={addLineItem}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            {t.addLineItem}
          </button>
        </FormSection>

        {/* Rates & Overrides */}
        <FormSection title={t.ratesOverrideSection}>
          <p className="text-xs text-gray-400 mb-5">{t.ratesOverrideHint}</p>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t.customRatesLabel}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Field label="Engineering (% van structuur)">
              <input type="number" step="0.1" className={inputClass} value={form.engineeringRatePct} onChange={set('engineeringRatePct')} placeholder="Standaard: 5%" />
            </Field>
            <Field label="CNC — CLT (€/m²)">
              <input type="number" step="0.01" className={inputClass} value={form.cncCltRatePerM2} onChange={set('cncCltRatePerM2')} placeholder="Standaard: €11" />
            </Field>
            <Field label="CNC — GL (€/m³)">
              <input type="number" step="0.01" className={inputClass} value={form.cncGlRatePerM3} onChange={set('cncGlRatePerM3')} placeholder="Standaard: €260" />
            </Field>
            <Field label="Accessoires (% van structuur)">
              <input type="number" step="0.1" className={inputClass} value={form.accessoiresRatePct} onChange={set('accessoiresRatePct')} placeholder="Standaard: 12%" />
            </Field>
            <Field label="Montage (% van structuur)">
              <input type="number" step="0.1" className={inputClass} value={form.montageRatePct} onChange={set('montageRatePct')} placeholder="Standaard: 22%" />
            </Field>
            <Field label="Transport (€/vrachtwagen)">
              <input type="number" step="0.01" className={inputClass} value={form.transportRatePerTruck} onChange={set('transportRatePerTruck')} placeholder="Standaard: €2.250" />
            </Field>
          </div>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t.fixedOverrideLabel}</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Engineering (€)">
              <input type="number" step="0.01" className={inputClass} value={form.engineeringOverride} onChange={set('engineeringOverride')} placeholder="Vaste prijs..." />
            </Field>
            <Field label="CNC — CLT (€)">
              <input type="number" step="0.01" className={inputClass} value={form.cncCltOverride} onChange={set('cncCltOverride')} placeholder="Vaste prijs..." />
            </Field>
            <Field label="CNC — GL (€)">
              <input type="number" step="0.01" className={inputClass} value={form.cncGlOverride} onChange={set('cncGlOverride')} placeholder="Vaste prijs..." />
            </Field>
            <Field label="Accessoires (€)">
              <input type="number" step="0.01" className={inputClass} value={form.accessoiresOverride} onChange={set('accessoiresOverride')} placeholder="Vaste prijs..." />
            </Field>
            <Field label="Montage (€)">
              <input type="number" step="0.01" className={inputClass} value={form.montageOverride} onChange={set('montageOverride')} placeholder="Vaste prijs..." />
            </Field>
            <Field label="Transport (€)">
              <input type="number" step="0.01" className={inputClass} value={form.transportOverride} onChange={set('transportOverride')} placeholder="Vaste prijs..." />
            </Field>
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection title={t.notesSectionForm}>
          <textarea
            className={`${inputClass} h-24 resize-none`}
            value={form.notes}
            onChange={set('notes')}
            placeholder={t.notesPlaceholder}
          />
        </FormSection>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate('/offertes')}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300"
          >
            {saving ? t.saving : isEdit ? t.saveChanges : t.createOfferte}
          </button>
        </div>
      </form>
    </div>
  )
}
