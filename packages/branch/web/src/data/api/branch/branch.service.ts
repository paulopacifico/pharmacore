import { api } from "@pharmacore/shared-web";
import {
    CreateBranchIn,
    UpdateBranchIn,
    FindManyBranchesOut,
    FindManyBranchesIn,
    BranchDetailsDTO,
    BranchOverviewDTO,
} from "@pharmacore/branch";

export interface FindManyBranchesParams extends FindManyBranchesIn {}

export async function getBranches(
    params: FindManyBranchesParams,
): Promise<FindManyBranchesOut> {
    const response = await api.get<FindManyBranchesOut>("/branches", {
        params: {
            page: params.page,
            pageSize: params.pageSize,
            ...(params.name && { name: params.name }),
        },
    });
    return response.data;
}

export async function getBranchById(id: string): Promise<BranchDetailsDTO> {
    const response = await api.get<BranchDetailsDTO>(`/branches/${id}`);
    return response.data;
}

export async function create(data: CreateBranchIn): Promise<void> {
    await api.post("/branches", data);
}

export async function update(
    id: string,
    data: Omit<UpdateBranchIn, "id">,
): Promise<void> {
    await api.patch(`/branches/${id}`, data);
}

export async function del(id: string): Promise<void> {
    await api.delete(`/branches/${id}`);
}

export async function getBranchOverview(): Promise<BranchOverviewDTO> {
    const response = await api.get<BranchOverviewDTO>("/branches/overview");
    return response.data;
}

export async function findAllBranches(): Promise<BranchDetailsDTO[]> {
    const response = await api.get<BranchDetailsDTO[]>("/branches");
    return response.data;
}

export async function findBranchById(id: string): Promise<BranchDetailsDTO> {
    return getBranchById(id);
}

export async function createBranch(data: CreateBranchIn): Promise<void> {
    await create(data);
}

export async function updateBranch(
    id: string,
    data: Partial<Omit<UpdateBranchIn, "id">>,
): Promise<void> {
    await api.patch(`/branches/${id}`, data);
}

export async function deleteBranch(id: string): Promise<void> {
    await del(id);
}
