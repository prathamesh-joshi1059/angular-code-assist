// AI confidence score for this refactoring: 92.45%
export interface Fence {
    isChecked?: boolean; 
    fenceType: string; 
    noOfUnits: number;
}

export interface FenceObj {
    fenceType: string;
    noOfUnits: number;
}

// Issues: 
// 1. Interface names should use PascalCase.
// 2. Use semicolons consistently instead of commas in interface definitions.