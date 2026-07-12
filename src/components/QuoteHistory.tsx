import React from 'react';
import { SavedQuote } from '../types';
import { FileText, Calendar, User, DollarSign, ArrowRight, Trash2, Download } from 'lucide-react';
import { CURRENCIES } from '../lib/constants';

interface QuoteHistoryProps {
  history: SavedQuote[];
  onLoadQuote: (quote: SavedQuote) => void;
  onDeleteQuote: (id: string) => void;
}

export default function QuoteHistory({ history, onLoadQuote, onDeleteQuote }: QuoteHistoryProps) {
  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.symbol || '$';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-xs">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="font-semibold text-gray-900 text-sm mb-1">No Estimates Yet</h4>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Your generated estimates will be stored here in your local history so you can manage, edit, and download them anytime.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-gray-900 text-sm">Past Estimates ({history.length})</h4>
            <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Stored locally</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map((quote) => {
              const currencySymbol = getCurrencySymbol(quote.quoteData.currency);
              return (
                <div
                  key={quote.id}
                  id={`history-quote-${quote.id}`}
                  className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-gray-50 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {quote.quoteData.quoteNumber}
                        </span>
                        <h5 className="font-bold text-gray-900 text-sm mt-1 truncate max-w-[180px]">
                          {quote.clientName}
                        </h5>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total Estimate</span>
                        <span className="font-extrabold text-gray-900 text-base">
                          {currencySymbol}{quote.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 py-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{formatDate(quote.quoteData.issueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{quote.quoteData.items.length} line items</span>
                      </div>
                    </div>
                    
                    {quote.quoteData.clientCompany && (
                      <div className="text-xs text-gray-400 italic bg-gray-50 p-2 rounded-lg truncate">
                        Client Company: <span className="text-gray-700 font-medium">{quote.quoteData.clientCompany}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50 mt-4">
                    <button
                      id={`load-quote-history-${quote.id}`}
                      onClick={() => onLoadQuote(quote)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-97"
                    >
                      <span>Edit & Reuse</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      id={`delete-quote-history-${quote.id}`}
                      onClick={() => onDeleteQuote(quote.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete estimate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
