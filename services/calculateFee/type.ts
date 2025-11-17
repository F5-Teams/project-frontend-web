export interface ShippingFeeData {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
  return_again: number;
  document_return: number;
  double_check: number;
  cod_fee: number;
  pick_remote_areas_fee: number;
  deliver_remote_areas_fee: number;
  cod_failed_fee: number;
}

export interface ShippingFeeResponse {
  code: number;
  message: string;
  data: ShippingFeeData;
}

export interface ShippingFeePayload {
  to_district_id: number;
  to_ward_code: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  service_type_id: number;
  cod_amount: number;
  insurance_value: number;
}
