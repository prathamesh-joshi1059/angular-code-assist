// AI confidence score for this refactoring: 78.10%
export interface Filter {
    search: string;
    projectTypes: string[];
    workTypes: string[];
    fenceTypes: string[];
    drivers: string[];
}

export interface FilterCounts {
    projectTypes: Record<string, number>;
    workTypes: Record<string, number>;
    drivers: Record<string, number>;
    driverWorkTypeCounts: Record<string, unknown>;
}

/*
- Use of `{} `instead of `Record<string, unknown>` for driverWorkTypeCounts
- No specific typing for driverWorkTypeCounts which violates strict typing standards
*/