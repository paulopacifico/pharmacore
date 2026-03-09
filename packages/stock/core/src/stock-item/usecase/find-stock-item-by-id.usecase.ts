import { Result, UseCase } from "@pharmacore/shared";
import { StockItemRepository } from "../provider/stock-item.repository";
import { StockItemIn, StockItemOut } from "../dto";

export interface FindStockItemByIdInput extends StockItemIn {}
export interface FindStockItemByIdOut extends StockItemOut {}

export class FindStockItemById implements UseCase<
	FindStockItemByIdInput,
	FindStockItemByIdOut
> {
	constructor(private readonly repo: StockItemRepository) {}

	async execute({
		id,
	}: FindStockItemByIdInput): Promise<Result<FindStockItemByIdOut>> {
		const result = await this.repo.findById(id);
		if (result.isFailure) {
			return result.withFail;
		}

		return Result.ok(result.instance);
	}
}
