import { Result, UseCase } from "@pharmacore/shared";
import { ProductRepository } from "../provider/product.repository";
import { ProductErrors } from "../errors";

export interface DeleteProductIn {
	id: string;
}

export class DeleteProductUseCase implements UseCase<DeleteProductIn, void> {
	constructor(private readonly provider: ProductRepository) {}
	async execute({ id }: DeleteProductIn): Promise<Result<void>> {
		const productExists = await this.provider.findById(id);

		if (productExists.isFailure) {
			return Result.fail(ProductErrors.NOT_FOUND);
		}

		return await this.provider.delete(id);
	}
}
