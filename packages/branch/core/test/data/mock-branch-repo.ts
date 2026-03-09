import {
    BranchRepository,
    Branch,
    BranchErrors,
    FindBranchDetailsByIdQuery,
    FindManyBranchesQuery,
    FindManyBranchesIn,
    FindManyBranchesOut,
    BranchDetailsDTO,
    BranchListDTO,
} from "../../src";
import { Result } from "@pharmacore/shared";

export class MockBranchRepository implements BranchRepository {
    public branches: Branch[] = [];

    async create(branch: Branch): Promise<Result<void>> {
        this.branches.push(branch);
        return Promise.resolve(Result.ok(undefined));
    }

    async update(branch: Branch): Promise<Result<void>> {
        const index = this.branches.findIndex((s) => s.id === branch.id);
        if (index === -1) {
            return Promise.resolve(Result.fail(BranchErrors.NOT_FOUND));
        }
        this.branches[index] = branch;
        return Promise.resolve(Result.ok(undefined));
    }

    async findById(id: string): Promise<Result<Branch>> {
        const s = this.branches.find((s) => s.id === id) || null;
        if (!s) {
            return Promise.resolve(Result.fail(BranchErrors.NOT_FOUND));
        }
        return Promise.resolve(Result.ok(s));
    }

    async findAll(): Promise<Result<Branch[]>> {
        return Promise.resolve(Result.ok([...this.branches]));
    }

    async delete(id: string): Promise<Result<void>> {
        const index = this.branches.findIndex((s) => s.id === id);
        if (index === -1) {
            return Promise.resolve(Result.fail(BranchErrors.NOT_FOUND));
        }
        this.branches.splice(index, 1);
        return Promise.resolve(Result.ok(undefined));
    }

    findDetailsById: FindBranchDetailsByIdQuery = {
        execute: async (
            branchId: string,
        ): Promise<Result<BranchDetailsDTO>> => {
            const branch = this.branches.find((b) => b.id === branchId);
            if (!branch) {
                return Promise.resolve(Result.fail(BranchErrors.NOT_FOUND));
            }
            return Promise.resolve(Result.ok(branch.props));
        },
    };

    findMany: FindManyBranchesQuery = {
        execute: async ({
            page = 1,
            pageSize = 10,
        }: FindManyBranchesIn): Promise<Result<FindManyBranchesOut>> => {
            const safePage = Math.max(1, Math.floor(page));
            const safePageSize = Math.min(
                Math.max(1, Math.floor(pageSize)),
                100,
            );
            const total = this.branches.length;
            const totalPages =
                total === 0 ? 0 : Math.ceil(total / safePageSize);
            const skip = (safePage - 1) * safePageSize;
            const list = this.branches
                .slice(skip, skip + safePageSize)
                .map((b) => b.props);
            return Promise.resolve(
                Result.ok({
                    data: list,
                    meta: {
                        page: safePage,
                        pageSize: safePageSize,
                        total,
                        totalPages,
                    },
                }),
            );
        },
    };

    reset() {
        this.branches = [];
    }
}
