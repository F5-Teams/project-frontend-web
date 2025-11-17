/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthResponse {
  data: any;
  token: string;
  access_token: string;
  accessToken: string;
  refreshToken?: string;
  user?: {
    id: string;
    username: string;
    [key: string]: any;
  };
}
