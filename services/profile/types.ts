export interface Role {
  id: number;
  name: string;
}
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
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  userName?: string;
  avatar?: string;
  gender?: boolean;
}

export type GetMeResponse = User;

export type UpdateUserResponse = User;
