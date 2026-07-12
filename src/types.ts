export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface LineItem {
  id: string;
  description: string;
  details?: string;
  unitPrice: number;
  quantity: number;
}

export interface BrandConfig {
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontStyle: 'sans' | 'serif' | 'mono';
  logoUrl?: string; // Base64 or local path
  logoName?: string;
  showWatermark: boolean;
  watermarkOpacity: number;
}

export interface QuoteInfo {
  quoteNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  paymentTerms: string;
  notes: string;
  taxRate: number; // percentage, e.g., 16 for 16%
  discountRate: number; // percentage, e.g., 5 for 5%
  
  // Sender info (overrides or uses brand defaults)
  senderName: string;
  senderCompany: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderTaxId?: string;
  
  // Recipient info
  clientId?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  
  // Content
  items: LineItem[];
}

export interface SavedQuote {
  id: string;
  title: string;
  dateCreated: string;
  clientName: string;
  totalAmount: number;
  quoteData: QuoteInfo;
  brandConfig: BrandConfig;
}
