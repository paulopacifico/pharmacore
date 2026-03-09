import { AddressProps, Result, UseCase } from "@pharmacore/shared";
import { BranchProps } from "../model/branch.entity";
import { BranchRepository } from "../provider/branch.repository";

export interface UpdateBranchIn {
    id: string;
    name?: string;
    cnpj?: string;
    isActive?: boolean;
    address?: AddressProps;
    establishedAt?: Date | null;
}

export class UpdateBranchUseCase implements UseCase<UpdateBranchIn, void> {
    constructor(private readonly repo: BranchRepository) {}

    async execute({
        id,
        name,
        cnpj,
        isActive,
        address,
        establishedAt,
    }: UpdateBranchIn): Promise<Result<void>> {
        const result = await this.repo.findById(id);
        if (result.isFailure) {
            return Result.fail(result.errors!);
        }

        const branch = result.instance;

        const updates: Partial<BranchProps> = {};
        if (name !== undefined) updates.name = name;
        if (cnpj !== undefined) updates.cnpj = cnpj;
        if (isActive !== undefined) updates.isActive = isActive;
        if (address !== undefined) updates.address = address;
        if (establishedAt !== undefined) updates.establishedAt = establishedAt;

        const updatedBranchResult = branch.cloneWith(updates);

        if (updatedBranchResult.isFailure) {
            return updatedBranchResult.withFail;
        }

        return this.repo.update(updatedBranchResult.instance);
    }
}
