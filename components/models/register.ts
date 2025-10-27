export interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;   
  password: string;
  phoneNumber: string;
  address: string;
  gender: string;
  avatar: string;
}

export interface User {
  id: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  address: string | null;
  avatar: string | null;
  gender: boolean | null; 
  isActive: boolean;
  createdAt: string; 
  role: UserRole;
  _count?: UserCount;
}

export enum RoleType {
  Staff = 1,
  Groomer = 2,
  User = 3,
  Admin = 4,
}

export interface UserRole {
  id: RoleType; 
  name: string; 
}

export interface UserCount {
  pets: number;
  bookingsAsCustomer: number;
  bookingsAsStaff: number;
  bookingsAsGroomer: number;
}