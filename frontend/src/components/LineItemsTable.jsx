const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"

export default function LineItemsTable({ items, onAdd, onRemove, onChange, addLabel, unitPlaceholder, t }) {
  return (
    <>
      {items.length > 0 && (
        <div className="mb-2">
          <div className="grid gap-2 mb-1 text-xs text-gray-400" style={{ gridTemplateColumns: '1fr 80px 90px 120px 90px 32px' }}>
            <span>{t.lineItemDescLabel}</span>
            <span>{t.lineItemQtyLabel}</span>
            <span>{t.lineItemUnitLabel}</span>
            <span>{t.lineItemPriceLabel}</span>
            <span className="text-right">Total</span>
            <span />
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="grid gap-2 mb-2" style={{ gridTemplateColumns: '1fr 80px 90px 120px 90px 32px' }}>
              <input className={inputClass} value={item.description} onChange={e => onChange(idx, 'description', e.target.value)} placeholder="Omschrijving..." />
              <input type="number" step="0.01" className={inputClass} value={item.quantity} onChange={e => onChange(idx, 'quantity', e.target.value)} placeholder="0" />
              <input className={inputClass} value={item.unit} onChange={e => onChange(idx, 'unit', e.target.value)} placeholder={unitPlaceholder} />
              <input type="number" step="0.01" className={inputClass} value={item.pricePerUnit} onChange={e => onChange(idx, 'pricePerUnit', e.target.value)} placeholder="0.00" />
              <div className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg text-right font-mono">
                €{((Number(item.quantity) || 0) * (Number(item.pricePerUnit) || 0)).toLocaleString('nl-BE', { minimumFractionDigits: 2 })}
              </div>
              <button type="button" onClick={() => onRemove(idx)} className="flex items-center justify-center text-red-400 hover:text-red-600 text-xl font-bold">×</button>
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={onAdd} className="text-sm text-amber-600 hover:text-amber-700 font-medium">{addLabel}</button>
    </>
  )
}