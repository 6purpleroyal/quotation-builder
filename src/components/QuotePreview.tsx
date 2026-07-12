import React from 'react';
import { QuoteInfo, BrandConfig } from '../types';
import { CURRENCIES, FONT_STYLES } from '../lib/constants';
import { Check, Mail, Phone, MapPin, Award } from 'lucide-react';

interface QuotePreviewProps {
  data: QuoteInfo;
  brand: BrandConfig;
}

export default function QuotePreview({ data, brand }: QuotePreviewProps) {
  const selectedCurrency = CURRENCIES.find((c) => c.code === data.currency) || CURRENCIES[0];
  const activeFont = FONT_STYLES.find((f) => f.id === brand.fontStyle) || FONT_STYLES[0];

  // Calculations
  const subtotal = data.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discountAmount = subtotal * (data.discountRate / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (data.taxRate / 100);
  const grandTotal = taxableAmount + taxAmount;

  // Custom inline styles based on branding settings
  const primaryColor = brand.primaryColor;
  const secondaryColor = brand.secondaryColor;
  const accentColor = brand.accentColor;

  return (
    <div className="w-full flex justify-center py-2 px-1 sm:p-4 overflow-x-auto bg-gray-100/70 rounded-3xl border border-gray-200/50">
      
      {/* 
        This is the actual page element designed to be converted to PDF.
        We enforce A4-like proportional layout but use classes that print nicely.
      */}
      <div
        id="quote-printable-area"
        className={`w-full max-w-[800px] min-h-[1130px] bg-white text-gray-800 p-6 sm:p-12 relative flex flex-col justify-between shadow-lg rounded-2xl ${activeFont.class} overflow-hidden text-left`}
        style={{ contentVisibility: 'auto' }}
      >
        {/* Background Watermark */}
        {brand.showWatermark && brand.logoUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
            style={{ opacity: brand.watermarkOpacity }}
          >
            <img
              src={brand.logoUrl}
              alt="Watermark"
              referrerPolicy="no-referrer"
              className="w-4/5 h-4/5 max-w-[500px] object-contain transform rotate-12"
            />
          </div>
        )}

        {/* Inner Content (above watermark) */}
        <div className="relative z-10 space-y-8 flex-1 flex flex-col justify-between">
          
          {/* TOP SECTION: Logo, Company Name, Estimate Header */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                {brand.logoUrl && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden p-1 shrink-0 border border-gray-100 shadow-xs">
                    <img
                      src={brand.logoUrl}
                      alt="Brand Logo"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="space-y-0.5 text-left">
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 leading-none">
                    {data.senderCompany || 'Zinga Studios'}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold opacity-85" style={{ color: primaryColor }}>
                    {data.senderName || 'Freelance Creative'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1 self-stretch sm:self-auto flex flex-col justify-end">
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-gray-900">ESTIMATE</h2>
                <div className="text-xs sm:text-sm font-bold bg-gray-50 sm:bg-transparent p-2 sm:p-0 rounded-lg flex sm:block justify-between items-center">
                  <span className="text-gray-400 font-medium sm:hidden">Reference:</span>
                  <span className="font-mono text-gray-800" style={{ color: primaryColor }}>
                    {data.quoteNumber || 'EST-2026-001'}
                  </span>
                </div>
              </div>
            </div>

            {/* SENDER & RECIPIENT INFORMATION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-left">
              {/* Sender Details */}
              <div className="space-y-2.5 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">FROM</h3>
                <div className="space-y-1">
                  <p className="font-extrabold text-gray-900 text-sm">{data.senderName}</p>
                  {data.senderCompany && <p className="font-medium text-gray-700">{data.senderCompany}</p>}
                  
                  <div className="space-y-0.5 pt-1.5 text-gray-600 font-medium">
                    {data.senderEmail && (
                      <p className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        {data.senderEmail}
                      </p>
                    )}
                    {data.senderPhone && <p className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400" />{data.senderPhone}</p>}
                    {data.senderTaxId && <p className="text-[10px] text-gray-400 font-mono mt-1">Tax ID: {data.senderTaxId}</p>}
                  </div>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-2.5 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">PREPARED FOR</h3>
                <div className="space-y-1">
                  <p className="font-extrabold text-gray-900 text-sm">{data.clientName || 'Add Recipient Name'}</p>
                  {data.clientCompany && <p className="font-medium text-gray-700">{data.clientCompany}</p>}
                  
                  <div className="space-y-0.5 pt-1.5 text-gray-600 font-medium">
                    {data.clientEmail && (
                      <p className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                        {data.clientEmail}
                      </p>
                    )}
                    {data.clientPhone && <p className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-400" />{data.clientPhone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* DATES & LOGISTICS METADATA BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 px-4 rounded-xl text-left border border-gray-100 bg-gray-50/20 text-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">DATE OF ISSUE</span>
                <span className="font-bold text-gray-900">{data.issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">VALID UNTIL</span>
                <span className="font-bold text-gray-900">{data.dueDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">CURRENCY</span>
                <span className="font-bold text-gray-900">{data.currency} ({selectedCurrency.symbol})</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">DELIVERY TYPE</span>
                <span className="font-bold text-gray-900">Digital / Remote</span>
              </div>
            </div>

            {/* ESTIMATE TABLE */}
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-xs">
              {/* Header */}
              <div
                className="grid grid-cols-12 gap-2 p-3 text-[10px] font-bold text-white uppercase text-left"
                style={{ backgroundColor: secondaryColor }}
              >
                <div className="col-span-6 sm:col-span-7">Service / Work Item Description</div>
                <div className="col-span-3 sm:col-span-2 text-right">Unit Price</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-100">
                {data.items.map((item, index) => {
                  const total = item.unitPrice * item.quantity;
                  return (
                    <div key={item.id || index} className="grid grid-cols-12 gap-2 p-3.5 text-xs text-left items-start hover:bg-gray-50/50">
                      <div className="col-span-6 sm:col-span-7 space-y-1">
                        <p className="font-bold text-gray-900">{item.description || 'New Service Item'}</p>
                        {item.details && (
                          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                            {item.details}
                          </p>
                        )}
                      </div>
                      
                      <div className="col-span-3 sm:col-span-2 text-right font-mono text-gray-700">
                        {selectedCurrency.symbol}{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      
                      <div className="col-span-1 text-center font-bold text-gray-800 font-mono">
                        {item.quantity}
                      </div>
                      
                      <div className="col-span-2 text-right font-bold font-mono text-gray-900">
                        {selectedCurrency.symbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FINANCIAL CALCULATIONS BOX */}
            <div className="flex justify-end pt-2 text-left">
              <div className="w-full sm:w-80 space-y-2 text-xs border border-gray-100 p-4 rounded-xl bg-gray-50/30">
                <div className="flex justify-between font-medium text-gray-500">
                  <span>Subtotal:</span>
                  <span className="font-mono text-gray-900 font-bold">
                    {selectedCurrency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                
                {data.discountRate > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-600">
                    <span>Discount ({data.discountRate}%):</span>
                    <span className="font-mono">
                      -{selectedCurrency.symbol}{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                
                {data.taxRate > 0 && (
                  <div className="flex justify-between font-semibold text-gray-600">
                    <span>VAT / Sales Tax ({data.taxRate}%):</span>
                    <span className="font-mono text-gray-900">
                      +{selectedCurrency.symbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div
                  className="flex justify-between font-extrabold text-sm text-white p-3.5 rounded-lg shadow-xs mt-3 select-none"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="uppercase tracking-wider">Grand Total:</span>
                  <span className="font-mono text-base">
                    {selectedCurrency.symbol}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Payment Terms & Legal Notes */}
          <div className="border-t border-gray-100 pt-6 mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-left">
              {data.paymentTerms && (
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]" style={{ color: primaryColor }}>
                    PAYMENT TERMS & MILESTONES
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-medium">{data.paymentTerms}</p>
                </div>
              )}

              {data.notes && (
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[10px]" style={{ color: primaryColor }}>
                    ESTIMATE TERMS & CONDITIONS
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-medium">{data.notes}</p>
                </div>
              )}
            </div>

            {/* THANK YOU FOOTER */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-[10px] text-gray-400 font-semibold border-t border-gray-50">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                Generated via Quotation Builder
              </span>
              <span className="mt-1 sm:mt-0 tracking-widest text-center sm:text-right uppercase">
                THANK YOU FOR YOUR BUSINESS!
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
