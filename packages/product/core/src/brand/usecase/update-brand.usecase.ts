import { Alias, Result, UseCase } from "@pharmacore/shared";
import { BrandRepository } from "../provider";
import { Brand, BrandProps } from "../model";
import { BrandErrors } from "../errors";

export interface UpdateBrandIn {
	id: string;
	name?: string;
	alias?: string;
}

export class UpdateBrandUseCase implements UseCase<UpdateBrandIn, void> {
	constructor(private readonly repo: BrandRepository) {}

	async execute(data: UpdateBrandIn): Promise<Result<void>> {
		const brandResult = await this.repo.findById(data.id);

		if (brandResult.isFailure) {
			return Result.fail(BrandErrors.NOT_FOUND);
		}

		const brand = brandResult.instance;
		const brandName = data.name ?? brand.name;
		const brandAlias = data.alias ?? brand.alias ?? Alias.fromText(brandName).value;

		const newBrandProps: BrandProps = {
			name: brandName,
			alias: brandAlias,
			id: brand.id,
		};

		const updatedBrandResult = Brand.tryCreate(newBrandProps);

		if (updatedBrandResult.isFailure) {
			return updatedBrandResult.withFail;
		}

		return await this.repo.update(updatedBrandResult.instance);
	}
}