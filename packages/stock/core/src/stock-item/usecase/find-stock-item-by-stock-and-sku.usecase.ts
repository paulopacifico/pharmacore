import { Result, UseCase } from "@pharmacore/shared";
import { StockItemRepository } from "../provider/stock-item.repository";
import { StockItemOut } from "../dto";

export interface FindStockByStockAndSkuInput {
	stockId: string;
	sku: string;
}

export interface FindStockItemByStockAndSkuOut extends StockItemOut {}

export class FindStockItemByStockAndSku implements UseCase<
	FindStockByStockAndSkuInput,
	FindStockItemByStockAndSkuOut
> {
	constructor(private readonly repo: StockItemRepository) {}

	async execute({
		sku,
		stockId,
	}: FindStockByStockAndSkuInput): Promise<
		Result<FindStockItemByStockAndSkuOut>
	> {
		const result = await this.repo.findByStockAndSku(stockId, sku);
		if (result.isFailure) {
			return result.withFail;
		}

		return Result.ok(result.instance);
	}
}
