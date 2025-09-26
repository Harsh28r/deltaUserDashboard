export interface FormField {
  name: string;
  type: string;
  required: boolean;
  options?: string[];
  _id?: string;
}

export interface LeadStatus {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  formFields: FormField[];
  isActive?: boolean;
  is_final_status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadStatusFormData {
  name: string;
  description?: string;
  color?: string;
  formFields: FormField[];
  isActive?: boolean;
  is_final_status?: boolean;
}

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "date", label: "Date" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
] as const;

export const STATUS_COLORS = [
  { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
  { value: "#10B981", label: "Green", class: "bg-green-500" },
  { value: "#F59E0B", label: "Yellow", class: "bg-yellow-500" },
  { value: "#EF4444", label: "Red", class: "bg-red-500" },
  { value: "#8B5CF6", label: "Purple", class: "bg-purple-500" },
  { value: "#06B6D4", label: "Cyan", class: "bg-cyan-500" },
  { value: "#F97316", label: "Orange", class: "bg-orange-500" },
  { value: "#6B7280", label: "Gray", class: "bg-gray-500" },
] as const;







