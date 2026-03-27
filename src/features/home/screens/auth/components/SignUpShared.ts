export type UserRole = "customer" | "driver" | "operator" | null;

export type Step =
  | "role"
  | "reminder"
  | "operator_reminder"
  | "info"
  | "address"
  | "documents";

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  province: string;
}

export interface ValidationResult {
  errors: Record<string, string>;
  isInfoValid: boolean;
  isAddressValid: boolean;
  isSenior: boolean;
}