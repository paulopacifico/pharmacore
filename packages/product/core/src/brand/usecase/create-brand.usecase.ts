import { Alias, Id, Result, UseCase } from "@pharmacore/shared";
import { BrandRepository } from "../provider";
import { Brand } from "../model";

export interface CreateBrandIn {
	name: string;
	alias?: string;
}

export class CreateBrandUseCase implements UseCase<CreateBrandIn, void> {
	constructor(private readonly repo: BrandRepository) {}

	async execute(data: CreateBrandIn): Promise<Result<void>> {
		const brandId = Id.create().value;

		const brandResult = Brand.tryCreate({
			...data,
			id: brandId,
			alias: data.alias ?? Alias.fromText(data.name).value,
		});

		if (brandResult.isFailure) {
			return brandResult.withFail;
		}

		const brand = brandResult.instance;

		return await this.repo.create(brand);
	}
}