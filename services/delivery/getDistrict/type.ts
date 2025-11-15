export interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
  NameExtension: string[];
  IsEnable: number;
  CanUpdateCOD: boolean;
  Status: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: {
    From: any[];
    To: any[];
    Return: any[];
  };
  WhiteListDistrict: {
    From: any | null;
    To: any | null;
  };
  GovernmentCode: string;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: any | null;
  CreatedIP: string;
  CreatedEmployee: number;
  CreatedSource: string;
  CreatedDate: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}
