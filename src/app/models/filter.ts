export interface Filter {
    search: string;
    projectTypes: string[];
    workTypes: string[];
    fenceTypes: string[];
    drivers: string[];
}

export interface FilterCounts {
    projectTypes: { [key: string]: number };
    workTypes: { [key: string]: number };
    drivers: { [key: string]: number };
    driverWorkTypeCounts: {}
}
