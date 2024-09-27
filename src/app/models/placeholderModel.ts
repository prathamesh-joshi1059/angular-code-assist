// AI confidence score for this refactoring: 92.85%
import { FenceObj } from "./fenceModel";

export class PlaceholderData { // Class name should be in PascalCase
    endDate: string;
    projectType: string;
    notes: string;
    address: string;
    workType: string;
    driver: string;
    clientName: string;
    startDate: string;
    fences: FenceObj[];
    branch: string;
    phone: string;
}

// Issues: 
// 1. Class name 'placeholderData' should be in PascalCase according to TypeScript conventions.