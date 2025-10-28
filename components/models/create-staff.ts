export interface CreateUser {
  role: Role;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  gender: boolean;
}

export type Role = "staff" | "groomer";