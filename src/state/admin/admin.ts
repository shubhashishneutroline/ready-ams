export type APiType = { isFlag?: boolean; response: any };
export type viewType = { view?: boolean };

export type ServiceType = {
  viewType: viewType;
  add: APiType;
  delete: APiType;
  edit: APiType;
  view: APiType;
};
// Define Form Schema
export interface AdminCustomerFormSchema {
  name: string;
  email: string;
  phone: string | number;
  role: string;
  isActive: boolean;
  password: string;

  street: string;
  city: string;
  country: string;
  zipCode: string;
}
export interface AdminAppointmentFormSchema {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status?: string;
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  createdById?: string | number;
  isForSelf?: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    password: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    lastActive: string;
    role: string;
    isActive: boolean;
  };
}
enum WeekDays {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}

interface ServiceAvailability {
  weekDay: string;
  timeSlots?: ServiceTime[];
}

export interface ServiceTime {
  startTime: string; // Required (ISO 8601 Date string)
  endTime: string; // Required (ISO 8601 Date string)
}
export interface AdminServiceFormSchema {
  title: string;
  description: string;
  estimatedDuration: string | number;
  status: string;
  serviceAvailability: ServiceAvailability[];
}

export interface AdminFAQFormSchema {
  question: string;
  answer: string;
}

export interface AdminResourceFormSchema {
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  service: { id: string }[];
}

export interface AdminTicketFormSchema {
  userType: string;
  subject: string;
  ticketDescription: string;
  category: string;
  priority: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  assignedTo?: string | null;
  resolutionDescription?: string;
  proofFiles?: string[] | null;
  initiatedById?: string | null;
  userId?: string;
}
// Define The Platform Schema for Each of the Form Driven Section of Admin
export interface CustomerPlatformSchema {
  id?: string | number | null;
  input: AdminCustomerFormSchema;
  details: AdminCustomerFormSchema[];
}

export interface ApointmentPlatformSchema {
  id?: string | number | null;
  input: AdminAppointmentFormSchema;
  details: AdminAppointmentFormSchema[];
}

export interface ServicePlatformSchema {
  id?: string | number | null;
  input: AdminServiceFormSchema;
  details: AdminServiceFormSchema[];
}

export interface NotificationPlatformSchema {
  id?: string | number | null;
  input: AdminServiceFormSchema;
  details: AdminServiceFormSchema[];
}
export interface FAQPlatformSchema {
  id?: string | number | null;
  input: AdminFAQFormSchema;
  details: AdminFAQFormSchema[];
}
export interface ResourcePlatformSchema {
  id?: string | number | null;
  input: AdminResourceFormSchema;
  details: AdminResourceFormSchema[];
}
export interface TicketPlatformSchema {
  id?: string | number | null;
  input: AdminTicketFormSchema;
  details: AdminTicketFormSchema[];
}

// Create the Platform Schema for Each of the form associated with CRUD
export interface CustomerPlatform {
  _add_CustomerForm: CustomerPlatformSchema;
  _edit_CustomerForm: CustomerPlatformSchema;
  _view_CustomerForm: CustomerPlatformSchema;
}

export interface AppointmentPlatform {
  _add_AppointmentForm: ApointmentPlatformSchema;
  _edit_AppointmentForm: ApointmentPlatformSchema;
  _view_AppointmentForm: ApointmentPlatformSchema;
}

export interface ServicePlatform {
  _add_ServiceForm: ServicePlatformSchema;
  _edit_ServiceForm: ServicePlatformSchema;
  _view_ServiceForm: ServicePlatformSchema;
}
export interface NotificationPlatform {
  _add_NotificationForm: ServicePlatformSchema;
  _edit_NotificationForm: ServicePlatformSchema;
  _view_NotificationForm: ServicePlatformSchema;
}
export interface FAQPlatform {
  _add_FAQForm: FAQPlatformSchema;
  _edit_FAQForm: FAQPlatformSchema;
  _view_FAQForm: FAQPlatformSchema;
}
export interface ResourcePlatform {
  _add_ResourceForm: ResourcePlatformSchema;
  _edit_ResourceForm: ResourcePlatformSchema;
  _view_ResourceForm: ResourcePlatformSchema;
}
export interface TicketPlatform {
  _add_TicketForm: TicketPlatformSchema;
  _edit_TicketForm: TicketPlatformSchema;
  _view_TicketForm: TicketPlatformSchema;
}

export type AdminApi = {
  user: ServiceType;
  sidebar: ServiceType;
  appointment: ServiceType;
  service: ServiceType;
  notification: ServiceType;
  support: ServiceType;
  business: ServiceType;
  availability: ServiceType;
  faq: ServiceType;
  ticket: ServiceType;
  businessDetails: ServiceType;
  resources: {
    staff: ServiceType;
    admin: ServiceType;
  };
  supportBusinessDetails: ServiceType;
  reminder: ServiceType;
  announcement: ServiceType;
};

export interface AdminSliceSchema {
  platform: {
    user: CustomerPlatform;
    appointment: AppointmentPlatform;
    service: ServicePlatform;
    notification: ServicePlatform;
    faq: FAQPlatform;
    resource: ResourcePlatform;
    ticket: TicketPlatform;
  };
  admin: AdminApi;
}

export const InitialApiData = {
    isFlag: false,
    response: {
      details: [],
      error: "",
      isLoading: false,
      isSuccess: false,
      toastMsg: "",
    },
  },
  InitialViewData = {
    view: true,
  },
  InitialServiceData = {
    viewType: InitialViewData,
    add: InitialApiData,
    delete: InitialApiData,
    edit: InitialApiData,
    view: InitialApiData,
  };
