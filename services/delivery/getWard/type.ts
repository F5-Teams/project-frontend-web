export interface Ward {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension: string[];
  CanUpdateCOD: boolean;
  SupportType: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: {
    From: any[];
    To: any[];
    Return: any[];
  };
  WhiteListWard: {
    From: any | null;
    To: any | null;
  };
  GovernmentCode: string;
  Status: number;
  Config: {
    From: {
      LockType: string;
    };
    To: {
      LockType: string;
    };
    Return: {
      LockType: string;
    };
  };
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: string[] | null;
  CreatedIP: string;
  CreatedEmployee: number;
  CreatedSource: string;
  CreatedDate: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
}
