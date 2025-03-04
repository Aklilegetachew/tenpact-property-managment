export interface FloorRequest {
  floorNumber: any;
  name: string;
}

export interface ShopRequest {
  shopNumber: string;
  size: string;
  floorId: number;
}

export interface ShopResponse {
  id: number;
  shopNumber: string;
  size: string;
  floorId: number;
  status: string;
}
