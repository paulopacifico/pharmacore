import { Result, UseCase } from "@pharmacore/shared";
import { StockItemRepository } from "../provider/stock-item.repository";
import { StockItemIn } from "../dto";

export interface DeleteStockByIdInput extends StockItemIn {}

export class DeleteStockItem implements UseCase<DeleteStockByIdInput, void> {
	constructor(private readonly repo: StockItemRepository) {}

	async execute({ id }: DeleteStockByIdInput): Promise<Result<void>> {
		const result = await this.repo.findById(id);
		if (result.isFailure) {
			return result.withFail;
		}

		return this.repo.delete(id);
	}
}
