export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  order?: number;
  lastUpdatedById: string;
  createdById: string;
}

// Enum for FAQ status (active or inactive)
export enum FAQStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
