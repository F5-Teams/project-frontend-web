export interface User {
  id: number;
  userName: string;
  avatar: string;
  phoneNumber: string;
  address: string;
  gender: boolean;
  firstName: string;
  lastName: string;
  createdAt: string;
  isActive: boolean;
  role: Role;
  walletBalance: number;
  walletStatus: string;
}

export interface Role {
  id: number;
  name: string;
}
