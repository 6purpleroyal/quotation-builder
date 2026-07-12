import { BrandConfig, QuoteInfo } from '../types';

export const COLOR_THEMES = [
  {
    name: 'Zinga Honeybee',
    primary: '#D97706', // amber-600
    secondary: '#1F2937', // gray-800
    accent: '#FCD34D', // amber-300
    textLight: '#FFFBEB', // amber-50
    class: 'amber'
  },
  {
    name: 'Emerald Mint',
    primary: '#059669', // emerald-600
    secondary: '#0F172A', // slate-900
    accent: '#A7F3D0', // emerald-200
    textLight: '#F0FDF4', // emerald-50
    class: 'emerald'
  },
  {
    name: 'Cobalt Royal',
    primary: '#2563EB', // blue-600
    secondary: '#1E293B', // slate-800
    accent: '#BFDBFE', // blue-200
    textLight: '#EFF6FF', // blue-50
    class: 'blue'
  },
  {
    name: 'Midnight Dark',
    primary: '#111827', // gray-900
    secondary: '#4B5563', // gray-600
    accent: '#E5E7EB', // gray-200
    textLight: '#F9FAFB', // gray-50
    class: 'neutral'
  },
  {
    name: 'Boutique Crimson',
    primary: '#DC2626', // red-600
    secondary: '#450A0A', // red-950
    accent: '#FECDD3', // red-200
    textLight: '#FEF2F2', // red-50
    class: 'red'
  }
];

export const FONT_STYLES = [
  { id: 'sans', name: 'Inter (Clean Sans)', class: 'font-sans' },
  { id: 'serif', name: 'Playfair (Elegant Serif)', class: 'font-serif' },
  { id: 'mono', name: 'Fira Code (Modern Mono)', class: 'font-mono' }
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
];

// Zinga Honeybee SVG DataURI
export const DEFAULT_ZINGA_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="%231F2937" stroke="%23F59E0B" stroke-width="4" />
  <polygon points="100,40 150,70 150,130 100,160 50,130 50,70" fill="none" stroke="%23F59E0B" stroke-width="1" stroke-dasharray="2,4" opacity="0.3"/>
  <ellipse cx="65" cy="90" rx="35" ry="12" transform="rotate(-30 65 90)" fill="%23FBBF24" opacity="0.7" stroke="%23F59E0B" stroke-width="1.5"/>
  <ellipse cx="135" cy="90" rx="35" ry="12" transform="rotate(30 135 90)" fill="%23FBBF24" opacity="0.7" stroke="%23F59E0B" stroke-width="1.5"/>
  <ellipse cx="70" cy="110" rx="25" ry="9" transform="rotate(-15 70 110)" fill="%23FBBF24" opacity="0.5" stroke="%23F59E0B" stroke-width="1"/>
  <ellipse cx="130" cy="110" rx="25" ry="9" transform="rotate(15 130 110)" fill="%23FBBF24" opacity="0.5" stroke="%23F59E0B" stroke-width="1"/>
  <ellipse cx="100" cy="115" rx="22" ry="32" fill="%23111827" stroke="%23F59E0B" stroke-width="2"/>
  <path d="M80,100 Q100,105 120,100" stroke="%23F59E0B" stroke-width="3" fill="none"/>
  <path d="M78,115 Q100,121 122,115" stroke="%23F59E0B" stroke-width="4" fill="none"/>
  <path d="M82,130 Q100,135 118,130" stroke="%23F59E0B" stroke-width="3" fill="none"/>
  <circle cx="100" cy="73" r="14" fill="%23111827" stroke="%23F59E0B" stroke-width="1.5"/>
  <circle cx="94" cy="70" r="2" fill="%23FBBF24"/>
  <circle cx="106" cy="70" r="2" fill="%23FBBF24"/>
  <path d="M92,62 Q90,52 82,50" stroke="%23FBBF24" stroke-width="1.5" fill="none"/>
  <path d="M108,62 Q110,52 118,50" stroke="%23FBBF24" stroke-width="1.5" fill="none"/>
  <path d="M100,180 Q105,195 100,198 Q95,195 100,180" fill="%23FBBF24"/>
  <path d="M130,157 Q135,172 130,175 Q125,172 130,157" fill="%23FBBF24"/>
  <path d="M70,157 Q75,172 70,175 Q65,172 70,157" fill="%23FBBF24"/>
</svg>
`)}`;

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  themeName: 'Zinga Honeybee',
  primaryColor: '#D97706',
  secondaryColor: '#1F2937',
  accentColor: '#FCD34D',
  fontStyle: 'sans',
  logoUrl: DEFAULT_ZINGA_LOGO,
  logoName: 'zinga.jpeg',
  showWatermark: true,
  watermarkOpacity: 0.12
};

export const DEFAULT_QUOTE_DATA: QuoteInfo = {
  quoteNumber: 'EST-2026-001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days later
  currency: 'USD',
  paymentTerms: '50% upfront deposit. 50% upon project approval prior to deployment.',
  notes: 'Thank you for choosing my freelance services! This estimate is valid for 30 days from the date of issue. Feel free to contact me with any adjustment requests.',
  taxRate: 16, // Default VAT
  discountRate: 5, // Discount
  
  senderName: 'David K. Zinga',
  senderCompany: 'Zinga Creative Studios',
  senderEmail: 'creative@zinga.com',
  senderPhone: '+254 712 345 678',
  senderAddress: '4th Floor, Honeycomb Hub\nNgong Road, Nairobi, Kenya',
  senderTaxId: 'KRA-PIN-Z093850X',
  
  clientName: 'Jane Doe',
  clientCompany: 'Acme Brand Solutions',
  clientEmail: 'jane@acme.com',
  clientPhone: '+1 555 123 4567',
  clientAddress: '101 Silicon Valley Boulevard\nSuite 500, San Jose, CA 95112',
  clientId: 'default-jane',
  
  items: [
    {
      id: 'item-1',
      description: 'Brand Visual Identity Package',
      details: 'Includes logo suite redesign (concepts, guidelines, color palette), custom typography pairings, business cards, letterhead, and 10 responsive vector social media templates.',
      unitPrice: 1500,
      quantity: 1
    },
    {
      id: 'item-2',
      description: 'Responsive Landing Page (React + Tailwind)',
      details: 'A high-converting, accessible page designed mobile-first. Includes custom smooth entrance animations, dark/light theme options, speed-optimized code, and integrated SEO meta-tags.',
      unitPrice: 850,
      quantity: 1
    },
    {
      id: 'item-3',
      description: 'AI-Powered Chat Assistant Integration',
      details: 'Development of server-side proxy route and connection to Gemini model. Features natural dialogue capabilities, dynamic contextual prompts, and beautiful custom chat widget UI.',
      unitPrice: 350,
      quantity: 2
    }
  ]
};
