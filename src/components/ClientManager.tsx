import React, { useState } from 'react';
import { ClientProfile } from '../types';
import { Search, Plus, UserPlus, Mail, Phone, MapPin, Trash2, Edit2, Check, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientManagerProps {
  clients: ClientProfile[];
  onAddClient: (client: Omit<ClientProfile, 'id'>) => void;
  onUpdateClient: (client: ClientProfile) => void;
  onDeleteClient: (id: string) => void;
  onSelectClientForBilling?: (client: ClientProfile) => void;
}

export default function ClientManager({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onSelectClientForBilling
}: ClientManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add client form state
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Edit client form state
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartAdd = () => {
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
    setNewAddress('');
    setNewNotes('');
    setIsAdding(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddClient({
      name: newName,
      company: newCompany || 'Freelance Client',
      email: newEmail,
      phone: newPhone,
      address: newAddress,
      notes: newNotes
    });

    setIsAdding(false);
  };

  const handleStartEdit = (client: ClientProfile) => {
    setEditingId(client.id);
    setEditName(client.name);
    setEditCompany(client.company);
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setEditAddress(client.address);
    setEditNotes(client.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;

    onUpdateClient({
      id,
      name: editName,
      company: editCompany,
      email: editEmail,
      phone: editPhone,
      address: editAddress,
      notes: editNotes
    });

    setEditingId(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-rose-100 text-rose-800 border-rose-200',
      'bg-teal-100 text-teal-800 border-teal-200'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="client-search-input"
            type="text"
            placeholder="Search saved clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              id="clear-client-search"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
        
        {!isAdding && (
          <button
            id="add-new-client-btn"
            onClick={handleStartAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm shadow-amber-600/10 active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            Add New Client
          </button>
        )}
      </div>

      {/* Add Client Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              id="add-client-form"
              onSubmit={handleSaveAdd}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-1">
                <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  New Client Profile
                </h3>
                <button
                  id="cancel-add-client"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="new-name" className="text-xs font-medium text-gray-600 block">Client Contact Name <span className="text-red-500">*</span></label>
                  <input
                    id="new-name"
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="new-company" className="text-xs font-medium text-gray-600 block">Company Name</label>
                  <input
                    id="new-company"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="new-email" className="text-xs font-medium text-gray-600 block">Email Address</label>
                  <input
                    id="new-email"
                    type="email"
                    placeholder="e.g. jane@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="new-phone" className="text-xs font-medium text-gray-600 block">Phone Number</label>
                  <input
                    id="new-phone"
                    type="tel"
                    placeholder="e.g. +1 555-123-4567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="new-address" className="text-xs font-medium text-gray-600 block">Billing Address</label>
                  <textarea
                    id="new-address"
                    rows={2}
                    placeholder="e.g. 123 Main St, Suite 400, New York, NY 10001"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="new-notes" className="text-xs font-medium text-gray-600 block">Private Notes (Default Terms, Preferences, etc.)</label>
                  <input
                    id="new-notes"
                    type="text"
                    placeholder="e.g. Prefers hourly rate, active since 2024"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  id="cancel-add-client-form-btn"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="save-add-client-btn"
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <UserPlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-1">No Clients Found</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {searchTerm ? 'Try adjusting your search filters or clear the query.' : 'Create client profiles to quickly prefill billing details in seconds.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map((client) => {
              const isEditing = editingId === client.id;
              const avatarStyle = getAvatarColor(client.name);
              
              return (
                <div
                  key={client.id}
                  id={`client-card-${client.id}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  {isEditing ? (
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Editing Profile</span>
                        <div className="flex gap-1">
                          <button
                            id={`save-edit-client-${client.id}`}
                            onClick={() => handleSaveEdit(client.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            id={`cancel-edit-client-${client.id}`}
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          id={`edit-name-${client.id}`}
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          placeholder="Contact Name"
                        />
                        <input
                          id={`edit-company-${client.id}`}
                          type="text"
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          placeholder="Company Name"
                        />
                        <input
                          id={`edit-email-${client.id}`}
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          placeholder="Email Address"
                        />
                        <input
                          id={`edit-phone-${client.id}`}
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          placeholder="Phone"
                        />
                        <textarea
                          id={`edit-address-${client.id}`}
                          rows={2}
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs resize-none"
                          placeholder="Billing Address"
                        />
                        <input
                          id={`edit-notes-${client.id}`}
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          placeholder="Private Notes"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Avatar and Title */}
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border ${avatarStyle} shrink-0`}>
                          {getInitials(client.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{client.name}</h4>
                          <p className="text-xs text-gray-500 font-medium truncate">{client.company}</p>
                        </div>
                      </div>

                      {/* Contacts details */}
                      <div className="space-y-2 border-t border-b border-gray-50 py-3 text-xs text-gray-600">
                        {client.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 text-left">{client.address}</span>
                          </div>
                        )}
                      </div>

                      {client.notes && (
                        <div className="bg-amber-50/50 border border-amber-100/40 p-2.5 rounded-lg text-[11px] text-amber-800 text-left">
                          <strong className="font-medium">Client Notes:</strong> {client.notes}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                        {onSelectClientForBilling && (
                          <button
                            id={`use-client-billing-${client.id}`}
                            onClick={() => onSelectClientForBilling(client)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 rounded-lg text-xs font-semibold border border-amber-100/50 transition-all active:scale-97"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Bill Client
                          </button>
                        )}
                        <div className="flex gap-1 ml-auto">
                          <button
                            id={`edit-client-btn-${client.id}`}
                            onClick={() => handleStartEdit(client)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-client-btn-${client.id}`}
                            onClick={() => onDeleteClient(client.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
