export interface ChannelPartner {
  _id: string;
  name: string;
  phone: string;
  firmName: string;
  location: string;
  address: string;
  mahareraNo: string;
  pinCode: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CPSourcing {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  channelPartnerId: {
    _id: string;
    name: string;
    phone: string;
  };
  projectId: {
    _id: string;
    name: string;
    location: string;
  };
  sourcingHistory: Array<{
    location: {
      lat: number;
      lng: number;
    };
    date: string;
    selfie: string;
    notes: string;
    _id: string;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FormField {
  name: string;
  type: string;
  required: boolean;
  options: string[];
  _id: string;
}

export interface StatusHistoryItem {
  status: {
    _id: string;
    name: string;
    formFields: FormField[];
    is_final_status: boolean;
  };
  data: any;
  changedAt: string;
  _id: string;
}

export interface Lead {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  leadSource?: {
    _id: string;
    name: string;
  } | null;
  currentStatus?: {
    _id: string;
    name: string;
    formFields: FormField[];
    is_final_status: boolean;
  } | null;
  project?: {
    _id: string;
    name: string;
  } | null;
  customData: {
    "First Name"?: string;
    "Email"?: string;
    "Phone"?: string;
    "Notes"?: string;
    "Lead Priority"?: string;
    "Property Type"?: string;
    "Configuration"?: string;
    "Funding Mode"?: string;
    "Gender"?: string;
    "Budget"?: string;
    "Channel Partner"?: string;
    "Channel Partner Sourcing"?: string;
    [key: string]: any;
  };
  statusHistory: StatusHistoryItem[];
  LeadScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  lead: {
    _id: string;
    currentStatus: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  action: string;
  details: any;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  firstName: string;
  email: string;
  phone: string;
  notes: string;
  leadSource: string;
  project: string;
  leadPriority: string;
  propertyType: string;
  configuration: string;
  fundingMode: string;
  gender: string;
  budget: string;
  [key: string]: any; // For dynamic status fields
}

export interface StatusFormData {
  newStatus: string;
  statusRemark: string;
  [key: string]: any; // For dynamic fields
}

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface LeadStatus {
  _id: string;
  name: string;
  formFields: FormField[];
  is_final_status: boolean;
}

export interface LeadSource {
  _id: string;
  name: string;
}

export interface Project {
  _id: string;
  name: string;
  location?: string;
  owner?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    level: string;
    mobile: string;
    companyName: string;
  };
  members?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    level: string;
    mobile: string;
    companyName: string;
  }>;
  managers?: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    level: string;
    mobile: string;
    companyName: string;
  }>;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  level: string;
  mobile: string;
  companyName: string;
}

