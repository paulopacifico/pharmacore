import { AddressProps, Result, UseCase } from "@pharmacore/shared";
import { Branch } from "../model/branch.entity";
import { BranchRepository } from "../provider/branch.repository";

export interface CreateBranchIn {
    name: string;
    cnpj: string;
    isActive: boolean;
    address: AddressProps;
    establishedAt?: Date | null;
}

export class CreateBranchUseCase implements UseCase<CreateBranchIn, void> {
    constructor(private readonly branchRepo: BranchRepository) {}

    async execute(data: CreateBranchIn): Promise<Result<void>> {
        const branchResult = Branch.tryCreate({
            name: data.name,
            cnpj: data.cnpj,
            isActive: data.isActive,
            address: data.address,
            establishedAt: data.establishedAt ?? null,
        });

        if (branchResult.isFailure) {
            return branchResult.withFail;
        }

        return this.branchRepo.create(branchResult.instance);
    }
}
