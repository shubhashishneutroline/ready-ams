export interface Address {
  street: string
  city: string
  country: string
  zipCode: string
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export interface User {
  id: string
  email: string // Required
  password: string // Required
  name: string // Required
  phone?: string // Optional
  role?: Role // Required
  isActive?: boolean // Optional, defaults to true
  address?: Address // Optional
}
