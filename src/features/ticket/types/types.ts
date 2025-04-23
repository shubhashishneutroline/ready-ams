export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN",
    CUSTOMER="CUSTOMER"
  }
  
export interface Ticket {
    id: string; // Unique ID for the ticket
    userType: Role; // Can be "Customer" or "Admin"
    subject: string; // Subject or title of the ticket
    ticketDescription: string; // Detailed description of the issue or request
    category: TicketCategory; // Type of issue (e.g., Technical Support, Billing)
    priority: Priority; // Priority level (Low, Medium, High)
    status: TicketStatus; // Status (Open, In Progress, Resolved, Closed)
    assignedTo?: string | null; // The support agent/admin assigned to resolve the ticket (optional)
    resolutionDescription?: string | null; // Description of how the issue was resolved (if applicable, optional)
    proofFiles?: string | null; // Path/URL to proof files (screenshots, documents, etc., optional)
    initiatedById?: string; // Foreign key for the user who initiated the ticket either admin or user, self (optional)
    userId: string; // User who the ticket is created for
  }
  
  export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
  }
 export enum TicketStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
  }
  export enum TicketCategory {
    TECHNICAL = "TECHNICAL", // For all technical issues, bugs, feature requests, etc.
    BILLING = "BILLING", // For any issues related to payment, invoices, subscriptions, refunds, etc.
    ACCOUNT = "ACCOUNT", // For account-related issues like login, profile management, or account access.
    GENERAL = "GENERAL", // For general inquiries, customer service requests, or questions.
    SUPPORT = "SUPPORT", // For customer support related issues that don't fit into the above categories.
    SECURITY = "SECURITY", // For issues related to security, account breaches, data protection, etc.
    MAINTENANCE = "MAINTENANCE", // For problems arising due to ongoing maintenance, outages, etc.
    FEEDBACK = "FEEDBACK", // For submitting feedback or suggestions for improvement.
  }
  