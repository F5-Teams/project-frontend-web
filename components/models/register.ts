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


export enum RoleId {
  Admin = 1,
  Staff = 2,
  Groomer = 3,
  Customer = 4,
}

export interface UserCounts {
  pets: number;
  bookingsAsCustomer: number;
  bookingsAsStaff: number;
  bookingsAsGroomer: number;
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
  roleId: RoleId;        
  _count: UserCounts;
}


