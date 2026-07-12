import React, { useState, useEffect } from 'react';
import { QuoteInfo, BrandConfig, ClientProfile, SavedQuote } from './types';
import {
  DEFAULT_BRAND_CONFIG,
  DEFAULT_QUOTE_DATA,
  DEFAULT_ZINGA_LOGO
} from './lib/constants';

// Subcomponents
import QuoteForm from './components/QuoteForm';
import QuotePreview from './components/QuotePreview';
import BrandingSettings from './components/BrandingSettings';
import ClientManager from './components/ClientManager';
import QuoteHistory from './components/QuoteHistory';

// Icons
import {
  FileText,
  Palette,
  Users,
  History,
  Download,
  Save,
  RotateCcw,
  Eye,
  Edit,
  Sparkles,
  ChevronRight,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// PDF Helpers
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Default mock profiles for first use
const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'client-1',
    name: 'Jane Doe',
    company: 'Acme Brand Solutions',
    email: 'jane@acme.com',
    phone: '+1 (555) 123-4567',
    address: '101 Silicon Valley Boulevard\nSuite 500, San Jose, CA 95112',
    notes: 'Likes high-contrast gold accents'
  },
  {
    id: 'client-2',
    name: 'Sarah Jenkins',
    company: 'Honeycomb Retailers',
    email: 'sarah@honeycomb.io',
    phone: '+254 711 222 333',
    address: 'Suite 12B, Westlands Office Park\nRing Road, Nairobi, Kenya',
    notes: 'Prefers digital bank deposits'
  },
  {
    id: 'client-3',
    name: 'Marcus Vance',
    company: 'Vanguard Media Group',
    email: 'm.vance@vanguard.co.uk',
    phone: '+44 20 7946 0192',
    address: '45 Primrose Hill Road\nLondon, NW3 3NL, United Kingdom',
    notes: 'Requires detailed sub-task descriptions'
  }
];

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'builder' | 'branding' | 'clients' | 'history'>('builder');
  
  // Mobile View Toggles (Form Editor vs. Live PDF Preview)
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Core App States (loaded with LocalStorage hydration)
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(DEFAULT_BRAND_CONFIG);
  const [quoteData, setQuoteData] = useState<QuoteInfo>(DEFAULT_QUOTE_DATA);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [history, setHistory] = useState<SavedQuote[]>([]);
  
  // Auxiliary States
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Hydrate on mount
  useEffect(() => {
    try {
      const savedBrand = localStorage.getItem('zinga_brand');
      if (savedBrand) setBrandConfig(JSON.parse(savedBrand));

      const savedDraft = localStorage.getItem('zinga_draft');
      if (savedDraft) setQuoteData(JSON.parse(savedDraft));

      const savedClients = localStorage.getItem('zinga_clients');
      if (savedClients) {
        setClients(JSON.parse(savedClients));
      } else {
        localStorage.setItem('zinga_clients', JSON.stringify(INITIAL_CLIENTS));
      }

      const savedHistory = localStorage.getItem('zinga_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error('Error hydrating localStorage state:', e);
    }
  }, []);

  // Save states to LocalStorage on updates
  const updateBrandConfig = (newConfig: BrandConfig) => {
    setBrandConfig(newConfig);
    localStorage.setItem('zinga_brand', JSON.stringify(newConfig));
  };

  const updateQuoteData = (newData: QuoteInfo) => {
    setQuoteData(newData);
    localStorage.setItem('zinga_draft', JSON.stringify(newData));
  };

  const updateClients = (newClients: ClientProfile[]) => {
    setClients(newClients);
    localStorage.setItem('zinga_clients', JSON.stringify(newClients));
  };

  const updateHistory = (newHistory: SavedQuote[]) => {
    setHistory(newHistory);
    localStorage.setItem('zinga_history', JSON.stringify(newHistory));
  };

  // Notification helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Client Management Handlers
  const handleAddClient = (client: Omit<ClientProfile, 'id'>) => {
    const newClient: ClientProfile = {
      ...client,
      id: `client-${Date.now()}`
    };
    const updated = [newClient, ...clients];
    updateClients(updated);
    showToast(`Added profile for ${client.name}!`, 'success');
  };

  const handleUpdateClient = (updatedClient: ClientProfile) => {
    const updated = clients.map((c) => (c.id === updatedClient.id ? updatedClient : c));
    updateClients(updated);
    showToast(`Updated ${updatedClient.name}'s profile.`, 'info');
  };

  const handleDeleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    const updated = clients.filter((c) => c.id !== id);
    updateClients(updated);
    if (client) {
      showToast(`Removed profile for ${client.name}.`, 'info');
    }
  };

  const handleSelectClientForBilling = (client: ClientProfile) => {
    const updatedQuote: QuoteInfo = {
      ...quoteData,
      clientId: client.id,
      clientName: client.name,
      clientCompany: client.company,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientAddress: client.address
    };
    updateQuoteData(updatedQuote);
    setActiveTab('builder');
    setMobileView('editor');
    showToast(`Prefilled quote details for ${client.name}!`, 'success');
  };

  const handleQuickSaveClientFromForm = (client: ClientProfile) => {
    const newClient: ClientProfile = {
      ...client,
      id: `client-${Date.now()}`
    };
    updateClients([newClient, ...clients]);
    
    // Update active quoteData with new saved client id
    updateQuoteData({
      ...quoteData,
      clientId: newClient.id
    });
    showToast(`Saved reusable profile for ${client.name}!`, 'success');
  };

  // History Handlers
  const handleLoadSavedQuote = (saved: SavedQuote) => {
    updateQuoteData(saved.quoteData);
    updateBrandConfig(saved.brandConfig);
    setActiveTab('builder');
    setMobileView('preview');
    showToast(`Loaded estimate ${saved.quoteData.quoteNumber}!`, 'success');
  };

  const handleDeleteSavedQuote = (id: string) => {
    const updated = history.filter((q) => q.id !== id);
    updateHistory(updated);
    showToast('Estimate removed from local history.', 'info');
  };

  // Reset Draft to Default template
  const handleResetDraft = () => {
    if (window.confirm('Are you sure you want to discard your current draft and restore default template values?')) {
      updateQuoteData(DEFAULT_QUOTE_DATA);
      updateBrandConfig(DEFAULT_BRAND_CONFIG);
      showToast('Draft estimate reset to Zinga default template.', 'info');
    }
  };

  // Clear current quote to empty form
  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear all details on this estimate form?')) {
      const cleared: QuoteInfo = {
        quoteNumber: `EST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: 'USD',
        paymentTerms: '',
        notes: '',
        taxRate: 0,
        discountRate: 0,
        senderName: quoteData.senderName,
        senderCompany: quoteData.senderCompany,
        senderEmail: quoteData.senderEmail,
        senderPhone: quoteData.senderPhone,
        senderAddress: quoteData.senderAddress,
        senderTaxId: quoteData.senderTaxId,
        clientName: '',
        clientCompany: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        clientId: 'manual',
        items: [{ id: 'item-new', description: '', details: '', unitPrice: 0, quantity: 1 }]
      };
      updateQuoteData(cleared);
      showToast('Cleared estimate fields.', 'info');
    }
  };

  // Save Estimate to Local History
  const handleSaveToHistory = () => {
    if (!quoteData.clientName.trim()) {
      showToast('Recipient client name is required to save an estimate.', 'error');
      return;
    }

    const subtotal = quoteData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const discountAmount = subtotal * (quoteData.discountRate / 100);
    const taxAmount = (subtotal - discountAmount) * (quoteData.taxRate / 100);
    const totalAmount = subtotal - discountAmount + taxAmount;

    const newSavedQuote: SavedQuote = {
      id: `saved-${Date.now()}`,
      title: `Estimate for ${quoteData.clientName}`,
      dateCreated: new Date().toISOString(),
      clientName: quoteData.clientName,
      totalAmount,
      quoteData: { ...quoteData },
      brandConfig: { ...brandConfig }
    };

    // Prevent duplicates of same estimate number in history by replacing or just saving fresh
    const existingIndex = history.findIndex((q) => q.quoteData.quoteNumber === quoteData.quoteNumber);
    let updatedHistory;
    if (existingIndex > -1) {
      updatedHistory = [...history];
      updatedHistory[existingIndex] = newSavedQuote;
      showToast(`Updated saved estimate ${quoteData.quoteNumber} in history!`, 'success');
    } else {
      updatedHistory = [newSavedQuote, ...history];
      showToast(`Estimate ${quoteData.quoteNumber} saved to history!`, 'success');
    }

    updateHistory(updatedHistory);
  };

  // Download PDF Renderer using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    const previousTab = activeTab;
    const previousMobileView = mobileView;
    let revertedToEditor = false;

    setIsGeneratingPdf(true);
    showToast('Compiling custom branded styles into PDF...', 'info');

    try {
      // 1. Ensure the element is mounted in the DOM and visible (not display: none or unmounted due to tab or mobile view)
      if (activeTab !== 'builder' || mobileView !== 'preview') {
        setActiveTab('builder');
        setMobileView('preview');
        revertedToEditor = true;
        // Allow a brief reflow and mount delay
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      const element = document.getElementById('quote-printable-area');
      if (!element) {
        throw new Error('Preview element not loaded in DOM.');
      }

      // 2. Temporarily override scroll / style scaling issues
      const originalStyle = element.style.cssText;
      
      // Ensure clean 100% size and sharp rendering for mobile
      element.style.transform = 'none';
      element.style.borderRadius = '0px';
      
      // Render to canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Double resolution for ultra-sharp vectors and text
        useCORS: true,
        allowTaint: false, // DO NOT allow taint! Tainted canvases throw SecurityError on toDataURL
        backgroundColor: '#ffffff',
        logging: false
      });

      // Restore style
      element.style.cssText = originalStyle;

      // 3. Map Canvas to A4 dimensions
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const computedHeight = canvasHeight / ratio;

      // Draw onto PDF page (handle simple multi-page spacing if necessary, but keep it tight single-page fit)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, computedHeight);
      
      // Generate unique readable file name
      const safeClientName = quoteData.clientName.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `estimate_${quoteData.quoteNumber}_${safeClientName || 'client'}.pdf`;
      
      // Trigger native download
      pdf.save(fileName);
      showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF Generation Failure:', err);
      showToast('Could not download PDF. If you are on a phone or preview iframe, try tapping the Print icon instead to save as PDF!', 'error');
    } finally {
      setIsGeneratingPdf(false);
      // Restore previous user navigation context
      if (revertedToEditor) {
        setActiveTab(previousTab);
        setMobileView(previousMobileView);
      }
    }
  };

  // Browser Print trigger (alternative standard option)
  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans select-none antialiased">
      
      {/* GLOBAL TOAST ALERTS */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 text-left"
          >
            <div className={`p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 ${
              notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-100/30' :
              notification.type === 'error' ? 'bg-red-50 text-red-800 border-red-200 shadow-red-100/30' :
              'bg-blue-50 text-blue-800 border-blue-200 shadow-blue-100/30'
            }`}>
              <Sparkles className={`w-4 h-4 shrink-0 ${notification.type === 'success' ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span className="flex-1">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR (Stylized Honeycomb Amber theme) */}
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-amber-500/20 shadow-sm text-white select-none">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Embedded Mini Logo SVG */}
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-black text-gray-950 shadow-md shadow-amber-500/10">
              <span className="text-sm tracking-tighter">Z</span>
            </div>
            <div className="text-left">
              <h1 className="font-extrabold text-base sm:text-lg tracking-wider text-white flex items-center gap-1.5 uppercase leading-none">
                Zinga <span className="text-amber-400 font-medium lowercase italic text-xs tracking-normal">creative</span>
              </h1>
              <span className="text-[9px] text-amber-500/80 font-bold block tracking-widest uppercase">Estimate Workspace</span>
            </div>
          </div>

          {/* Quick Header Actions (Visible on Desktop) */}
          {activeTab === 'builder' && (
            <div className="hidden md:flex items-center gap-2">
              <button
                id="reset-template-hdr"
                onClick={handleResetDraft}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Draft
              </button>
              
              <button
                id="save-history-hdr"
                onClick={handleSaveToHistory}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-800 hover:bg-gray-750 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold border border-amber-500/20 transition-all cursor-pointer active:scale-98"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft Profile
              </button>

              <button
                id="download-pdf-hdr"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 text-gray-950 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-500/10 cursor-pointer active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                {isGeneratingPdf ? 'Compiling...' : 'Download Estimate'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* TAB NAVIGATION BAR (Mobile First Scrollable) */}
        <div className="flex bg-gray-200/50 p-1.5 rounded-2xl border border-gray-200/40 select-none justify-between sm:justify-start gap-1 overflow-x-auto shrink-0 scrollbar-none">
          <button
            id="tab-btn-builder"
            onClick={() => setActiveTab('builder')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            Build Estimate
          </button>

          <button
            id="tab-btn-branding"
            onClick={() => setActiveTab('branding')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-600" />
            Invoice Branding
          </button>

          <button
            id="tab-btn-clients"
            onClick={() => setActiveTab('clients')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 text-amber-600" />
            Saved Clients
          </button>

          <button
            id="tab-btn-history"
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <History className="w-4 h-4 text-amber-600" />
            Estimate Archive
          </button>
        </div>

        {/* WORKSPACE CONTENT BODY */}
        <div className="flex-1 min-h-0">
          
          {/* TAB 1: BUILDER WORKSPACE (Dual Column / Multi view) */}
          {activeTab === 'builder' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
              
              {/* Left Side: Editor Form */}
              <div className={`lg:col-span-6 space-y-6 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
                {/* Form header details with reset/clear actions */}
                <div className="flex justify-between items-center bg-gray-100/50 p-3.5 rounded-2xl border border-gray-200/20">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">Drafting Board</span>
                  <div className="flex gap-2">
                    <button
                      id="clear-form-btn"
                      onClick={handleClearForm}
                      className="px-2.5 py-1 text-[11px] font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      Clear All
                    </button>
                    <button
                      id="reset-template-btn"
                      onClick={handleResetDraft}
                      className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-50 rounded-lg transition-all border border-amber-200/30 cursor-pointer"
                    >
                      Template Default
                    </button>
                  </div>
                </div>

                <QuoteForm
                  data={quoteData}
                  onChangeData={updateQuoteData}
                  clients={clients}
                  onQuickSaveClient={handleQuickSaveClientFromForm}
                />
              </div>

              {/* Right Side: Branded PDF Live-Preview */}
              <div className={`lg:col-span-6 lg:sticky lg:top-24 space-y-4 ${mobileView === 'editor' ? 'hidden lg:block' : 'block'}`}>
                <div className="flex justify-between items-center bg-gray-100/50 p-3.5 rounded-2xl border border-gray-200/20">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">Real-Time Invoice Preview</span>
                  <div className="flex gap-2">
                    <button
                      id="print-estimate-preview"
                      onClick={handlePrintQuote}
                      className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                      title="Print or Save natively"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full font-bold">Auto-updates</span>
                  </div>
                </div>

                <QuotePreview data={quoteData} brand={brandConfig} />
              </div>

            </div>
          )}

          {/* TAB 2: BRANDING CUSTOMIZER */}
          {activeTab === 'branding' && (
            <BrandingSettings config={brandConfig} onUpdateConfig={updateBrandConfig} />
          )}

          {/* TAB 3: CLIENT PROFILES */}
          {activeTab === 'clients' && (
            <ClientManager
              clients={clients}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              onSelectClientForBilling={handleSelectClientForBilling}
            />
          )}

          {/* TAB 4: ARCHIVE HISTORY */}
          {activeTab === 'history' && (
            <QuoteHistory
              history={history}
              onLoadQuote={handleLoadSavedQuote}
              onDeleteQuote={handleDeleteSavedQuote}
            />
          )}

        </div>
      </main>

      {/* STICKY BOTTOM ACTION NAV (Visible on mobile/tablet for simple one-click operations) */}
      <footer className="sticky bottom-0 z-40 bg-white border-t border-gray-200 py-3 px-4 shadow-xl select-none shrink-0 block lg:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {activeTab === 'builder' ? (
            <>
              {/* Edit / View PDF Screen toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 flex-1 justify-between select-none">
                <button
                  id="mobile-view-editor"
                  onClick={() => setMobileView('editor')}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 cursor-pointer ${
                    mobileView === 'editor'
                      ? 'bg-white text-gray-900 shadow-xs font-extrabold'
                      : 'text-gray-500'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Form
                </button>
                <button
                  id="mobile-view-preview"
                  onClick={() => setMobileView('preview')}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 cursor-pointer ${
                    mobileView === 'preview'
                      ? 'bg-white text-gray-900 shadow-xs font-extrabold'
                      : 'text-gray-500'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Live PDF
                </button>
              </div>

              {/* Action buttons (save / download pdf) */}
              <button
                id="mobile-save-history"
                onClick={handleSaveToHistory}
                className="p-2.5 bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 rounded-xl cursor-pointer"
                title="Save Estimate Draft"
              >
                <Save className="w-4 h-4" />
              </button>

              <button
                id="mobile-download-pdf"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="p-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-gray-950 font-black rounded-xl shadow-md transition-all cursor-pointer"
                title="Download Branded PDF Estimate"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full text-center py-1 text-[10px] text-gray-400 font-medium tracking-wide uppercase">
              Configure using tabs above
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
