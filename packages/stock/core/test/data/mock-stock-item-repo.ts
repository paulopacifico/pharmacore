import { StockItem, StockItemRepository, StockError } from "../../src";
import { Result } from "@pharmacore/shared";

export class MockStockItemRepository implements StockItemRepository {
	public stockItems: StockItem[] = [];

	async create(stockItem: StockItem): Promise<Result<void>> {
		this.stockItems.push(stockItem);
		return Promise.resolve(Result.ok(undefined));
	}

	async findByStockAndSku(
		stockId: string,
		sku: string,
	): Promise<Result<StockItem>> {
		const item = this.stockItems.find(
			(si) => si.stockId === stockId && si.sku === sku,
		);
		if (!item) {
			return Result.fail(StockError.NOT_FOUND);
		}
		return Result.ok(item);
	}

	async findById(id: string): Promise<Result<StockItem>> {
		const item = this.stockItems.find((si) => si.id === id) || null;
		if (!item) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		return Promise.resolve(Result.ok(item));
	}

	async findAll(): Promise<Result<StockItem[]>> {
		return Promise.resolve(Result.ok(this.stockItems));
	}

	async update(stockItem: StockItem): Promise<Result<void>> {
		const index = this.stockItems.findIndex((si) => si.id === stockItem.id);
		if (index === -1) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		this.stockItems[index] = stockItem;
		return Promise.resolve(Result.ok(undefined));
	}

	async delete(id: string): Promise<Result<void>> {
		const index = this.stockItems.findIndex((si) => si.id === id);
		if (index === -1) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		this.stockItems.splice(index, 1);
		return Promise.resolve(Result.ok(undefined));
	}

	reset() {
		this.stockItems = [];
	}
}
