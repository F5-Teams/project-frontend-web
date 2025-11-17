export interface Voucher {
  id: number;
  code: string;
  customerId: number;
  percent: number;
  isActive: boolean;
  createdAt: string;
  expiredAt: string | null;
}
