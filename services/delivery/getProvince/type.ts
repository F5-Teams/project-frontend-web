export interface Province {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  RegionID: number;
  RegionCPN: number;
  AreaID: number;
  CanUpdateCOD: boolean;
  Status: number;
  CreatedAt?: string | null;
  CreatedDate?: string | null;
  UpdatedAt?: string | null;
  UpdatedDate?: string | null;
  UpdatedEmployee?: number | null;
  CreatedEmployee?: number | null;
  UpdatedSource?: string | null;
  CreatedSource?: string | null;
  IsEnable: number;
}
