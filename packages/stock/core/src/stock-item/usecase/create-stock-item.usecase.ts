import { Result, UseCase } from "@pharmacore/shared";
import { StockItem } from "../model/stock-item.entity";
import { StockItemRepository } from "../provider/stock-item.repository";

export interface CreateStockItemIn {
	stockId: string;
	sku: string;
	name?: string;
}

export class CreateStockItem implements UseCase<CreateStockItemIn, void> {
	constructor(private readonly stockRepo: StockItemRepository) {}

	async execute(data: CreateStockItemIn): Promise<Result<void>> {
		const stockResult = StockItem.tryCreate({
			name: data.name,
			sku: data.sku,
			stockId: data.stockId,
		});

		if (stockResult.isFailure) {
			return stockResult.withFail;
		}

		return this.stockRepo.create(stockResult.instance);
	}
}
