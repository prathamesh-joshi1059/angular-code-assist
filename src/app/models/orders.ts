// AI confidence score for this refactoring: 82.55%
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
  geoPoint: GeoPointModel; // Fixed casing for class name
}

class Fences {
  fenceType: string;
  noOfUnits: number;
}

class GeoPointModel { // Fixed casing for class name
  latitude: number;
  longitude: number;
}

/*
- Class names should generally be in PascalCase.
- Missing visibility modifiers (public/private) for class properties.
- The `geoPoint` property name does not follow the camelCase convention.