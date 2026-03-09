export interface BranchOverviewKpi {
    total: number;
    active: number;
    inactive: number;
    statesCount: number;
}

export interface BranchByState {
    state: string;
    count: number;
}

export interface BranchRecentItem {
    id: string;
    name: string;
    city: string;
    state: string;
    isActive: boolean;
    createdAt: Date;
}

export interface BranchByYear {
    year: number;
    count: number;
}

export interface BranchOverviewDTO {
    kpi: BranchOverviewKpi;
    byState: BranchByState[];
    recentBranches: BranchRecentItem[];
    byYear: BranchByYear[];
}
