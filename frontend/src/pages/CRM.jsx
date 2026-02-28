import { useEffect, useState } from 'react'
import { api } from '../utils/api'

const SALUTATIONS = ['MR', 'MRS', 'DR', 'PROF', 'IR']
const SALUTATION_LABELS = { MR: 'Mr.', MRS: 'Mrs.', DR: 'Dr.', PROF: 'Prof.', IR: 'Ir.' }

function CRM() {
  const [activeTab, setActiveTab] = useState('contacts')

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-amber-600 text-white rounded-lg p-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-gray-800">CRM</h2>
          <p className="text-gray-600">Manage contacts and companies</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activeTab === 'contacts'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activeTab === 'companies'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Companies
        </button>
      </div>

      {activeTab === 'contacts' ? <ContactsTab /> : <CompaniesTab />}
    </div>
  )
}

/* ─── CONTACTS TAB ─────────────────────────────────────────── */

function ContactsTab() {
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)   // view detail
  const [editing, setEditing] = useState(null)      // add/edit form
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchContacts(); fetchCompanies() }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setContacts(await api.get('/api/contacts'))
      setError(null)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const fetchCompanies = async () => {
    try { setCompanies(await api.get('/api/companies')) }
    catch { /* non-critical */ }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return
    try {
      await api.delete(`/api/contacts/${id}`)
      setSelected(null)
      await fetchContacts()
    } catch (err) { setError(err.message) }
  }

  const filtered = contacts.filter(c =>
    `${c.firstName} ${c.lastName} ${c.companyName || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Contact
        </button>
      </div>

      {error && <ErrorBar message={error} />}

      {filtered.length === 0 ? (
        <EmptyState icon="person" text="No contacts yet. Add your first contact to get started." />
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Company</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Job Title</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Phone</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr
                  key={c.id}
                  className="hover:bg-amber-50 cursor-pointer transition-colors"
                  onClick={() => setSelected(c)}
                >
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {c.salutation ? SALUTATION_LABELS[c.salutation] + ' ' : ''}{c.firstName} {c.lastName}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.companyName || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4 text-gray-600">{c.jobTitle || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4 text-gray-600">{c.email || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4 text-gray-600">{c.phone || c.mobile || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => { setEditing(c); setShowForm(true) }}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <ContactDetailModal
          contact={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setSelected(null); setShowForm(true) }}
          onDelete={() => handleDelete(selected.id)}
        />
      )}

      {/* Add / Edit form modal */}
      {showForm && (
        <ContactFormModal
          contact={editing}
          companies={companies}
          onClose={() => { setShowForm(false); setEditing(null) }}
          onSaved={() => { setShowForm(false); setEditing(null); fetchContacts() }}
        />
      )}
    </div>
  )
}

function ContactDetailModal({ contact, onClose, onEdit, onDelete }) {
  const sal = contact.salutation ? SALUTATION_LABELS[contact.salutation] + ' ' : ''
  const address = [
    contact.street && contact.streetNumber ? `${contact.street} ${contact.streetNumber}` : contact.street,
    contact.postcode && contact.city ? `${contact.postcode} ${contact.city}` : contact.city,
    contact.country
  ].filter(Boolean).join(', ')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{sal}{contact.firstName} {contact.lastName}</h3>
            {contact.jobTitle && <p className="text-gray-500 text-sm">{contact.jobTitle}</p>}
            {contact.companyName && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">{contact.companyName}</span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <DetailSection label="Contact">
            {contact.email && <DetailRow icon="email" value={contact.email} />}
            {contact.phone && <DetailRow icon="phone" label="Phone" value={contact.phone} />}
            {contact.mobile && <DetailRow icon="mobile" label="Mobile" value={contact.mobile} />}
            {contact.website && <DetailRow icon="web" value={contact.website} />}
          </DetailSection>

          {address && (
            <DetailSection label="Address">
              <p className="text-gray-700 text-sm">{address}</p>
            </DetailSection>
          )}

          {contact.notes && (
            <DetailSection label="Notes">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{contact.notes}</p>
            </DetailSection>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t">
          <button onClick={onEdit}
            className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">
            Edit
          </button>
          <button onClick={onDelete}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors">
            Delete
          </button>
          <button onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function ContactFormModal({ contact, companies, onClose, onSaved }) {
  const [form, setForm] = useState({
    salutation: contact?.salutation || '',
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    jobTitle: contact?.jobTitle || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    mobile: contact?.mobile || '',
    website: contact?.website || '',
    street: contact?.street || '',
    streetNumber: contact?.streetNumber || '',
    postcode: contact?.postcode || '',
    city: contact?.city || '',
    country: contact?.country || 'België',
    notes: contact?.notes || '',
    companyId: contact?.companyId ? String(contact.companyId) : ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEdit = !!contact

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.lastName.trim()) { setError('Last name is required'); return }
    setError(null)
    try {
      setLoading(true)
      const payload = { ...form, companyId: form.companyId ? parseInt(form.companyId) : null,
        salutation: form.salutation || null }
      if (isEdit) await api.put(`/api/contacts/${contact.id}`, payload)
      else await api.post('/api/contacts', payload)
      onSaved()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Contact' : 'Add Contact'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Salutation</label>
              <select value={form.salutation} onChange={set('salutation')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">—</option>
                {SALUTATIONS.map(s => <option key={s} value={s}>{SALUTATION_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
              <input value={form.firstName} onChange={set('firstName')} placeholder="First name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>
              <input value={form.lastName} onChange={set('lastName')} placeholder="Last name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Job Title" value={form.jobTitle} onChange={set('jobTitle')} placeholder="e.g. Project Manager" />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
              <select value={form.companyId} onChange={set('companyId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">No company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email" value={form.email} onChange={set('email')} placeholder="email@example.com" type="email" />
            <FormField label="Phone" value={form.phone} onChange={set('phone')} placeholder="+32 ..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Mobile" value={form.mobile} onChange={set('mobile')} placeholder="+32 ..." />
            <FormField label="Website" value={form.website} onChange={set('website')} placeholder="https://..." />
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Address</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-2">
                <FormField label="Street" value={form.street} onChange={set('street')} placeholder="Street name" />
              </div>
              <FormField label="Nr." value={form.streetNumber} onChange={set('streetNumber')} placeholder="12A" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Postcode" value={form.postcode} onChange={set('postcode')} placeholder="2000" />
              <FormField label="City" value={form.city} onChange={set('city')} placeholder="Antwerp" />
              <FormField label="Country" value={form.country} onChange={set('country')} placeholder="België" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg disabled:bg-gray-400 transition-colors">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Contact'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── COMPANIES TAB ─────────────────────────────────────────── */

function CompaniesTab() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchCompanies() }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      setCompanies(await api.get('/api/companies'))
      setError(null)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return
    try {
      await api.delete(`/api/companies/${id}`)
      setSelected(null)
      await fetchCompanies()
    } catch (err) { setError(err.message) }
  }

  const filtered = companies.filter(c =>
    `${c.name} ${c.city || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Company
        </button>
      </div>

      {error && <ErrorBar message={error} />}

      {filtered.length === 0 ? (
        <EmptyState icon="building" text="No companies yet. Add your first company to get started." />
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Company</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">City</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">VAT</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-amber-50 cursor-pointer transition-colors" onClick={() => setSelected(c)}>
                  <td className="px-5 py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="px-5 py-4 text-gray-600">{c.city || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4 text-gray-600">{c.phone || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4 text-gray-600">{c.email || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4 text-gray-600">{c.vatNumber || <span className="text-gray-400">—</span>}</td>
                  <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => { setEditing(c); setShowForm(true) }}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <CompanyDetailModal
          company={selected}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setSelected(null); setShowForm(true) }}
          onDelete={() => handleDelete(selected.id)}
        />
      )}

      {showForm && (
        <CompanyFormModal
          company={editing}
          onClose={() => { setShowForm(false); setEditing(null) }}
          onSaved={() => { setShowForm(false); setEditing(null); fetchCompanies() }}
        />
      )}
    </div>
  )
}

function CompanyDetailModal({ company, onClose, onEdit, onDelete }) {
  const address = [
    company.street && company.streetNumber ? `${company.street} ${company.streetNumber}` : company.street,
    company.postcode && company.city ? `${company.postcode} ${company.city}` : company.city,
    company.country
  ].filter(Boolean).join(', ')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-800">{company.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <DetailSection label="Contact">
            {company.email && <DetailRow label="Email" value={company.email} />}
            {company.phone && <DetailRow label="Phone" value={company.phone} />}
            {company.website && <DetailRow label="Website" value={company.website} />}
          </DetailSection>

          {address && (
            <DetailSection label="Address">
              <p className="text-gray-700 text-sm">{address}</p>
            </DetailSection>
          )}

          {company.vatNumber && (
            <DetailSection label="Business">
              <DetailRow label="VAT" value={company.vatNumber} />
            </DetailSection>
          )}

          {company.notes && (
            <DetailSection label="Notes">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{company.notes}</p>
            </DetailSection>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t">
          <button onClick={onEdit}
            className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">Edit</button>
          <button onClick={onDelete}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors">Delete</button>
          <button onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

function CompanyFormModal({ company, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: company?.name || '',
    email: company?.email || '',
    phone: company?.phone || '',
    website: company?.website || '',
    vatNumber: company?.vatNumber || '',
    street: company?.street || '',
    streetNumber: company?.streetNumber || '',
    postcode: company?.postcode || '',
    city: company?.city || '',
    country: company?.country || 'België',
    notes: company?.notes || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEdit = !!company

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Company name is required'); return }
    setError(null)
    try {
      setLoading(true)
      if (isEdit) await api.put(`/api/companies/${company.id}`, form)
      else await api.post('/api/companies', form)
      onSaved()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">{isEdit ? 'Edit Company' : 'Add Company'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField label="Company Name *" value={form.name} onChange={set('name')} placeholder="Company name" />

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email" value={form.email} onChange={set('email')} placeholder="info@company.com" type="email" />
            <FormField label="Phone" value={form.phone} onChange={set('phone')} placeholder="+32 ..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Website" value={form.website} onChange={set('website')} placeholder="https://..." />
            <FormField label="VAT Number" value={form.vatNumber} onChange={set('vatNumber')} placeholder="BE 0xxx.xxx.xxx" />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Address</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-2">
                <FormField label="Street" value={form.street} onChange={set('street')} placeholder="Street name" />
              </div>
              <FormField label="Nr." value={form.streetNumber} onChange={set('streetNumber')} placeholder="12A" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Postcode" value={form.postcode} onChange={set('postcode')} placeholder="2000" />
              <FormField label="City" value={form.city} onChange={set('city')} placeholder="Antwerp" />
              <FormField label="Country" value={form.country} onChange={set('country')} placeholder="België" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={set('notes')} rows="3" placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg disabled:bg-gray-400 transition-colors">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Company'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── SHARED HELPERS ────────────────────────────────────────── */

function FormField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
    </div>
  )
}

function DetailSection({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      {label && <span className="text-gray-500 w-16 shrink-0">{label}</span>}
      <span className="text-gray-800">{value}</span>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <svg className="animate-spin h-10 w-10 text-amber-600" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="bg-white rounded-xl shadow p-12 text-center border-2 border-dashed border-gray-300">
      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p className="text-gray-500">{text}</p>
    </div>
  )
}

function ErrorBar({ message }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  )
}

export default CRM
