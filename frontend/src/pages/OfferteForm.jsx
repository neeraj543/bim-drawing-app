import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'

const EMPTY_FORM = {
  offerteNumber: '',
  date: new Date().toISOString().split('T')[0],
  preparedBy: '',
  projectDescription: '',
  submissionDeadline: '',
  status: 'DRAFT',
  clientName: '',
  clientStreet: '',
  clientStreetNumber: '',
  clientPostcode: '',
  clientCity: '',
  clientVatNumber: '',
  siteAddress: '',
  finishGrade: '',
  projectType: '',
  numberOfUnits: '',
  buildingDimensions: '',
  numberOfFloors: '',
  roofType: '',
  roofPitch: '',
  corniceHeight: '',
  ridgeHeight: '',
  ceilingHeightKelder: '',
  ceilingHeightGelijkvloers: '',
  ceilingHeightVerdiep1: '',
  ceilingHeightZolderverdiep: '',
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
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/offertes/${id}`)
        .then(data => {
          setForm({
            ...EMPTY_FORM,
            ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? '']))
          })
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
      )
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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate('/offertes')} className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1">
            ← Back to Offertes
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Offerte' : 'New Offerte'}</h1>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* General Info */}
        <FormSection title="General Info">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Offerte Number *">
              <input className={inputClass} value={form.offerteNumber} onChange={set('offerteNumber')} required placeholder="001/2025" />
            </Field>
            <Field label="Date *">
              <input type="date" className={inputClass} value={form.date} onChange={set('date')} required />
            </Field>
            <Field label="Prepared By">
              <input className={inputClass} value={form.preparedBy} onChange={set('preparedBy')} />
            </Field>
            <Field label="Project Description *">
              <input className={inputClass} value={form.projectDescription} onChange={set('projectDescription')} required />
            </Field>
            <Field label="Submission Deadline">
              <input type="date" className={inputClass} value={form.submissionDeadline} onChange={set('submissionDeadline')} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.status} onChange={set('status')}>
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </Field>
          </div>
        </FormSection>

        {/* Client */}
        <FormSection title="Client">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Client Name *">
              <input className={inputClass} value={form.clientName} onChange={set('clientName')} required />
            </Field>
            <Field label="VAT Number">
              <input className={inputClass} value={form.clientVatNumber} onChange={set('clientVatNumber')} />
            </Field>
            <Field label="Construction Site Address">
              <input className={inputClass} value={form.siteAddress} onChange={set('siteAddress')} />
            </Field>
            <Field label="Street">
              <input className={inputClass} value={form.clientStreet} onChange={set('clientStreet')} />
            </Field>
            <Field label="Number">
              <input className={inputClass} value={form.clientStreetNumber} onChange={set('clientStreetNumber')} />
            </Field>
            <Field label="Postcode">
              <input className={inputClass} value={form.clientPostcode} onChange={set('clientPostcode')} />
            </Field>
            <Field label="City">
              <input className={inputClass} value={form.clientCity} onChange={set('clientCity')} />
            </Field>
          </div>
        </FormSection>

        {/* Building Details */}
        <FormSection title="Building Details">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Finish Grade">
              <input className={inputClass} value={form.finishGrade} onChange={set('finishGrade')} placeholder="Structuur" />
            </Field>
            <Field label="Project Type">
              <input className={inputClass} value={form.projectType} onChange={set('projectType')} placeholder="Particulier" />
            </Field>
            <Field label="Number of Units">
              <input type="number" className={inputClass} value={form.numberOfUnits} onChange={set('numberOfUnits')} />
            </Field>
            <Field label="Building Dimensions (L×B)">
              <input className={inputClass} value={form.buildingDimensions} onChange={set('buildingDimensions')} placeholder="12m × 8m" />
            </Field>
            <Field label="Number of Floors">
              <input type="number" className={inputClass} value={form.numberOfFloors} onChange={set('numberOfFloors')} />
            </Field>
            <Field label="Roof Type">
              <input className={inputClass} value={form.roofType} onChange={set('roofType')} placeholder="Zadeldak" />
            </Field>
            <Field label="Roof Pitch">
              <input className={inputClass} value={form.roofPitch} onChange={set('roofPitch')} />
            </Field>
            <Field label="Cornice Height">
              <input className={inputClass} value={form.corniceHeight} onChange={set('corniceHeight')} />
            </Field>
            <Field label="Ridge Height">
              <input className={inputClass} value={form.ridgeHeight} onChange={set('ridgeHeight')} />
            </Field>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3">Ceiling Heights</p>
            <div className="grid grid-cols-4 gap-4">
              <Field label="Kelder">
                <input className={inputClass} value={form.ceilingHeightKelder} onChange={set('ceilingHeightKelder')} />
              </Field>
              <Field label="Gelijkvloers">
                <input className={inputClass} value={form.ceilingHeightGelijkvloers} onChange={set('ceilingHeightGelijkvloers')} />
              </Field>
              <Field label="Verdiep 1">
                <input className={inputClass} value={form.ceilingHeightVerdiep1} onChange={set('ceilingHeightVerdiep1')} />
              </Field>
              <Field label="Zolderverdiep">
                <input className={inputClass} value={form.ceilingHeightZolderverdiep} onChange={set('ceilingHeightZolderverdiep')} />
              </Field>
            </div>
          </div>
        </FormSection>

        {/* Structure & Pricing */}
        <FormSection title="Structure & Pricing">
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
              <Field label="Number of Trucks">
                <input type="number" className={inputClass} value={form.numberOfTrucks} onChange={set('numberOfTrucks')} />
              </Field>
            </div>
          </div>

          {/* Roostering */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
              <input type="checkbox" checked={form.includeRoostring} onChange={set('includeRoostring')} className="rounded" />
              Include Roostering met Beplating (OSB 22mm)
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

        {/* Overrides */}
        <FormSection title="Override Auto-Calculations (optional)">
          <p className="text-xs text-gray-400 mb-4">Leave blank to use auto-calculated values.</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Engineering (€)">
              <input type="number" step="0.01" className={inputClass} value={form.engineeringOverride} onChange={set('engineeringOverride')} placeholder="Auto (5%)" />
            </Field>
            <Field label="CNC — CLT (€)">
              <input type="number" step="0.01" className={inputClass} value={form.cncCltOverride} onChange={set('cncCltOverride')} placeholder="Auto (€11/m²)" />
            </Field>
            <Field label="CNC — GL (€)">
              <input type="number" step="0.01" className={inputClass} value={form.cncGlOverride} onChange={set('cncGlOverride')} placeholder="Auto (€260/m³)" />
            </Field>
            <Field label="Accessoires (€)">
              <input type="number" step="0.01" className={inputClass} value={form.accessoiresOverride} onChange={set('accessoiresOverride')} placeholder="Auto (12%)" />
            </Field>
            <Field label="Montage (€)">
              <input type="number" step="0.01" className={inputClass} value={form.montageOverride} onChange={set('montageOverride')} placeholder="Auto (22%)" />
            </Field>
            <Field label="Transport (€)">
              <input type="number" step="0.01" className={inputClass} value={form.transportOverride} onChange={set('transportOverride')} placeholder="Auto (€2250/truck)" />
            </Field>
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection title="Notes">
          <textarea
            className={`${inputClass} h-24 resize-none`}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Additional notes..."
          />
        </FormSection>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate('/offertes')}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Offerte'}
          </button>
        </div>
      </form>
    </div>
  )
}
