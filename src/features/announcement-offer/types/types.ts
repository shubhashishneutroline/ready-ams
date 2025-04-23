// Enum for Showon
export enum Showon {
    BANNER = "BANNER",
    PUSH = "PUSH",
    EMAIL = "EMAIL",
    ALL = "ALL",
  }
  
  // Enum for TargetAudience
  export enum TargetAudience {
    ALL = "ALL",
    APPOINTED_USERS = "APPOINTED_USERS",
    CANCELLED_USERS = "CANCELLED_USERS",
  }
  
  // Enum for ExpirationDuration
  export enum ExpirationDuration {
    ONE_DAY = "ONE_DAY",
    THREE_DAYS = "THREE_DAYS",
    SEVEN_DAYS = "SEVEN_DAYS",
    THIRTY_DAYS = "THIRTY_DAYS",
    NEVER = "NEVER",
  }
  
  // Interface for AnnouncementOrOffer
  export interface AnnouncementOrOffer {
    id: string;
    title: string; // Required field for the title of the announcement or offer
    description?: string; // Optional: Description of the announcement or offer
    message?: string; // Optional: Custom message for the announcement or offer
    audience: TargetAudience; // Required: Target audience for the announcement
    isImmediate: boolean; // Required: Indicates if the announcement or offer is immediate
    scheduledAt: string; // Required: ISO string for the scheduled date and time
    showOn: Showon; // Required: Where the announcement should show (e.g., banner, push notification, email)
    expiredAt: ExpirationDuration; // Required: Expiration duration or "never"
  }
  
 