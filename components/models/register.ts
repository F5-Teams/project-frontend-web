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

export interface User{
  id: number;
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  gender?: boolean | null; 
  avatar?: string | null;
  isActive?: boolean;
  createdAt?: string; 
}