import { Result, UseCase } from "@pharmacore/shared";
import { Audit, AuditProps } from "../model";
import { AuditRepository } from "../provider";

export interface CreateAuditInDTO extends AuditProps {}

export class CreateAuditUseCase implements UseCase<CreateAuditInDTO, void> {
    constructor(private readonly repo: AuditRepository) {}

    async execute(data: CreateAuditInDTO): Promise<Result<void>> {
        const auditResult = Audit.tryCreate(data);
        if (auditResult.isFailure) {
            return auditResult.withFail;
        }

        const saveResult = await this.repo.create(auditResult.instance);
        if (saveResult.isFailure) {
            return saveResult.withFail;
        }

        return Result.ok();
    }
}
