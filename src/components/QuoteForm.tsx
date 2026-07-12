import React from 'react';
import { QuoteInfo, LineItem, ClientProfile } from '../types';
import { CURRENCIES } from '../lib/constants';
import { Plus, Trash2, Calendar, FileText, User, Briefcase, PlusCircle, MinusCircle, ShieldCheck } from 'lucide-react';

interface QuoteFormProps {
  data: QuoteInfo;
  onChangeData: (data: QuoteInfo) => void;
  clients: ClientProfile[];
  onQuickSaveClient: (client: ClientProfile) => void;
}

export default function QuoteForm({ data, onChangeData, clients, onQuickSaveClient }: QuoteFormProps) {
  
  // Handlers for Sender Info
  const handleSenderChange = (field: keyof QuoteInfo, value: any) => {
    onChangeData({
      ...data,
      [field]: value
    });
  };

  // Handlers for Client Selection
  const handleClientSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === 'manual') {
      onChangeData({
        ...data,
        clientId: 'manual',
        clientName: '',
        clientCompany: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: ''
      });
      return;
    }

    const client = clients.find((c) => c.id === selectedId);
    if (client) {
      onChangeData({
        ...data,
        clientId: client.id,
        clientName: client.name,
        clientCompany: client.company,
        clientEmail: client.email,
        clientPhone: client.phone,
        clientAddress: client.address
      });
    }
  };

  const handleClientFieldChange = (field: keyof QuoteInfo, value: string) => {
    onChangeData({
      ...data,
      [field]: value
    });
  };

  // Quick save current client details as a reusable profile
  const handleQuickSaveCurrentClient = () => {
    if (!data.clientName.trim()) return;
    onQuickSaveClient({
      id: '', // Will be assigned by parent
      name: data.clientName,
      company: data.clientCompany || 'Freelance Client',
      email: data.clientEmail,
      phone: data.clientPhone,
      address: data.clientAddress
    });
  };

  // Line Item Handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: '',
      details: '',
      unitPrice: 0,
      quantity: 1
    };
    onChangeData({
      ...data,
      items: [...data.items, newItem]
    });
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = data.items.filter((item) => item.id !== itemId);
    onChangeData({
      ...data,
      items: updatedItems.length > 0 ? updatedItems : [{ id: 'empty', description: '', details: '', unitPrice: 0, quantity: 1 }]
    });
  };

  const handleItemChange = (itemId: string, field: keyof LineItem, value: any) => {
    const updatedItems = data.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    onChangeData({
      ...data,
      items: updatedItems
    });
  };

  const adjustQty = (itemId: string, currentQty: number, delta: number) => {
    const newQty = Math.max(1, currentQty + delta);
    handleItemChange(itemId, 'quantity', newQty);
  };

  // Calculations
  const subtotal = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discountAmount = subtotal * (data.discountRate / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (data.taxRate / 100);
  const grandTotal = taxableAmount + taxAmount;
  
  const selectedCurrency = CURRENCIES.find((c) => c.code === data.currency) || CURRENCIES[0];

  return (
    <div className="space-y-6 text-left">
      
      {/* SECTION 1: Freelancer Profile */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
          <Briefcase className="w-4 h-4 text-amber-600" />
          <h4 className="font-bold text-gray-900 text-sm">Your Freelancer Details (Sender)</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="sender-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Name / Freelancer Name</label>
            <input
              id="sender-name"
              type="text"
              value={data.senderName}
              onChange={(e) => handleSenderChange('senderName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. David K. Zinga"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="sender-company" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Company / Brand</label>
            <input
              id="sender-company"
              type="text"
              value={data.senderCompany}
              onChange={(e) => handleSenderChange('senderCompany', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. Zinga Creative Studios"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="sender-email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
            <input
              id="sender-email"
              type="email"
              value={data.senderEmail}
              onChange={(e) => handleSenderChange('senderEmail', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. creative@zinga.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="sender-phone" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Phone Number</label>
            <input
              id="sender-phone"
              type="tel"
              value={data.senderPhone}
              onChange={(e) => handleSenderChange('senderPhone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. +254 712 345 678"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label htmlFor="sender-address" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Physical Address</label>
            <textarea
              id="sender-address"
              rows={2}
              value={data.senderAddress}
              onChange={(e) => handleSenderChange('senderAddress', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
              placeholder="e.g. Honeycomb Hub, Ngong Road, Nairobi"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="sender-tax-id" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tax ID / PIN (Optional)</label>
            <input
              id="sender-tax-id"
              type="text"
              value={data.senderTaxId || ''}
              onChange={(e) => handleSenderChange('senderTaxId', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. KRA-PIN-XYZ"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Recipient Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-gray-900 text-sm">Bill To (Client Recipient)</h4>
          </div>
          
          {/* Quick Select Profile Dropdown */}
          <div className="flex items-center gap-1.5 shrink-0 max-w-full">
            <label htmlFor="client-selector" className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Prefill Profile:</label>
            <select
              id="client-selector"
              value={data.clientId || 'manual'}
              onChange={handleClientSelectChange}
              className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              <option value="manual">-- Manual Entry --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="client-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Contact Name <span className="text-red-500">*</span></label>
            <input
              id="client-name"
              type="text"
              required
              value={data.clientName}
              onChange={(e) => handleClientFieldChange('clientName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="client-company" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Company Name</label>
            <input
              id="client-company"
              type="text"
              value={data.clientCompany}
              onChange={(e) => handleClientFieldChange('clientCompany', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="client-email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Email Address</label>
            <input
              id="client-email"
              type="email"
              value={data.clientEmail}
              onChange={(e) => handleClientFieldChange('clientEmail', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. jane@acme.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="client-phone" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Phone Number</label>
            <input
              id="client-phone"
              type="tel"
              value={data.clientPhone}
              onChange={(e) => handleClientFieldChange('clientPhone', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. +1 555-123-4567"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label htmlFor="client-address" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Billing Address</label>
            <textarea
              id="client-address"
              rows={2}
              value={data.clientAddress}
              onChange={(e) => handleClientFieldChange('clientAddress', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
              placeholder="e.g. 101 Silicon Valley Boulevard, Suite 500, San Jose, CA"
            />
          </div>
        </div>

        {/* Quick Save Option */}
        {data.clientName && data.clientId === 'manual' && (
          <div className="pt-2 flex justify-end">
            <button
              id="quick-save-client-profile"
              type="button"
              onClick={handleQuickSaveCurrentClient}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-lg text-xs font-semibold border border-amber-200/40 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Save Reusable Profile
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: Invoice Meta (dates, quote #, currency) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
          <Calendar className="w-4 h-4 text-amber-600" />
          <h4 className="font-bold text-gray-900 text-sm">Estimate & Currency Configurations</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label htmlFor="quote-number" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimate Number</label>
            <input
              id="quote-number"
              type="text"
              value={data.quoteNumber}
              onChange={(e) => handleSenderChange('quoteNumber', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              placeholder="e.g. EST-2026-001"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="issue-date" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Issue Date</label>
            <input
              id="issue-date"
              type="date"
              value={data.issueDate}
              onChange={(e) => handleSenderChange('issueDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="due-date" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Valid Until Date</label>
            <input
              id="due-date"
              type="date"
              value={data.dueDate}
              onChange={(e) => handleSenderChange('dueDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="currency-selector" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Billing Currency</label>
            <select
              id="currency-selector"
              value={data.currency}
              onChange={(e) => handleSenderChange('currency', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: Line Items (Mobile-First Card Layout) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-gray-900 text-sm">Line Items & Services</h4>
          </div>
          
          <button
            id="add-line-item-top"
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition-colors border border-amber-200/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>

        {/* Responsive Items Render */}
        <div className="space-y-4">
          {data.items.map((item, index) => {
            const itemSubtotal = item.unitPrice * item.quantity;
            return (
              <div
                key={item.id}
                id={`item-editor-${item.id}`}
                className="bg-gray-50/50 hover:bg-gray-50 rounded-2xl p-4 border border-gray-200/50 space-y-3 transition-colors text-left relative"
              >
                {/* Card header with trash */}
                <div className="flex items-center justify-between border-b border-gray-200/40 pb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item #{index + 1}</span>
                  <button
                    id={`delete-item-${item.id}`}
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Description Title */}
                <div className="space-y-1">
                  <label htmlFor={`desc-${item.id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Title / Service Description <span className="text-red-500">*</span></label>
                  <input
                    id={`desc-${item.id}`}
                    type="text"
                    required
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    placeholder="e.g. Website development & visual redesign"
                  />
                </div>

                {/* Detail Description */}
                <div className="space-y-1">
                  <label htmlFor={`details-${item.id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sub-tasks / Long description (Optional)</label>
                  <textarea
                    id={`details-${item.id}`}
                    rows={2}
                    value={item.details || ''}
                    onChange={(e) => handleItemChange(item.id, 'details', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
                    placeholder="e.g. UI layout, Figma styles, responsiveness, API mapping"
                  />
                </div>

                {/* Quantity and Price row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Unit Price */}
                  <div className="space-y-1">
                    <label htmlFor={`price-${item.id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unit Price ({selectedCurrency.symbol})</label>
                    <input
                      id={`price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Quantity Counter */}
                  <div className="space-y-1">
                    <label htmlFor={`qty-${item.id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Quantity</label>
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                      <button
                        id={`qty-minus-${item.id}`}
                        type="button"
                        onClick={() => adjustQty(item.id, item.quantity, -1)}
                        className="text-gray-400 hover:text-amber-600 transition-colors p-1"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full bg-transparent text-center text-xs font-semibold focus:outline-none border-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        id={`qty-plus-${item.id}`}
                        type="button"
                        onClick={() => adjustQty(item.id, item.quantity, 1)}
                        className="text-gray-400 hover:text-amber-600 transition-colors p-1"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calculated Subtotal */}
                  <div className="flex flex-col justify-end text-right pb-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Subtotal</span>
                    <span className="text-sm font-extrabold text-gray-800">
                      {selectedCurrency.symbol}{itemSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add line item bottom trigger */}
        <button
          id="add-line-item-bottom"
          type="button"
          onClick={handleAddItem}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs text-gray-500 font-medium hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Service / Work Item
        </button>
      </div>

      {/* SECTION 5: Overall summary modifiers (taxes, discounts) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="overall-tax-rate" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">VAT / Sales Tax (%)</label>
              <span className="text-[10px] text-gray-500 font-bold">+{selectedCurrency.symbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <input
              id="overall-tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={data.taxRate}
              onChange={(e) => handleSenderChange('taxRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              placeholder="e.g. 16"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="overall-discount-rate" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Discount (%)</label>
              <span className="text-[10px] text-emerald-600 font-bold">-{selectedCurrency.symbol}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <input
              id="overall-discount-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={data.discountRate}
              onChange={(e) => handleSenderChange('discountRate', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              placeholder="e.g. 10"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: Payment terms & Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="payment-terms-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Payment Terms & Milestones</label>
            <textarea
              id="payment-terms-input"
              rows={2}
              value={data.paymentTerms}
              onChange={(e) => handleSenderChange('paymentTerms', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
              placeholder="e.g. 50% upfront, 50% upon delivery"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="additional-notes-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimate Notes / Bank Account Details</label>
            <textarea
              id="additional-notes-input"
              rows={3}
              value={data.notes}
              onChange={(e) => handleSenderChange('notes', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
              placeholder="e.g. Please send deposits to Bank XYZ. Estimate is valid for 30 days."
            />
          </div>
        </div>
      </div>

    </div>
  );
}
