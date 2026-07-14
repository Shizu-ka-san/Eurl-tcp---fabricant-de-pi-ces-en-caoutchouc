export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  imagePrompt: string; // Used for identifying aesthetic/icon reference
  specs: {
    hardness: string; // e.g. "50 - 85 Shore A"
    materials: string[]; // e.g. ["NBR", "EPDM"]
    series: string; // "Moyennes & Grandes Séries"
    tolerances: string; // e.g. "ISO 3302-1 M2"
  };
  features: string[];
  applications: string[];
  imageUrl?: string; // Image URL or Base64 data of the product photo
}

export interface Category {
  id: string;
  label: string;
}

export interface MaterialInfo {
  id: string;
  name: string;
  fullName: string;
  tempRange: string;
  hardnessRange: string;
  strengths: string[];
  weaknesses: string[];
  color: string; // Tailwind color class for visual badges
  commonApplications: string[];
}

export interface Machine {
  id: string;
  name: string;
  type: "injection" | "compression";
  capacity: string;
  features: string[];
  description: string;
  benefits: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface QuoteRequest {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  partDescription: string;
  seriesVolume: "moyenne" | "grande" | "tres-grande";
  estimatedQuantity: string;
  preferredMaterial: string;
  approximateSize: string;
  shoreHardness: string;
  processChoice: "undecided" | "injection" | "compression";
}

export interface QuoteResponse {
  success: boolean;
  quoteId?: string;
  message: string;
  receivedAt?: string;
}
