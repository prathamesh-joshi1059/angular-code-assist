import { StringUtils } from "@azure/msal-browser";

export class Orders {
  projectType: string;
  clientName: string;
  startDate: string;
  endDate: string;
  address: string;
  phone: string;
  orderId: string;
  fences: Fences[];
  workType: string;
  driver: string;
  isPlaceholder: boolean;
  notes: string;
  url: string;
  branch: string;
  geoPoint:geoPointModel
}

class Fences {
  fenceType: string;
  noOfUnits: number;
}

class geoPointModel{
  latitude:number;
  longitude:number;
}