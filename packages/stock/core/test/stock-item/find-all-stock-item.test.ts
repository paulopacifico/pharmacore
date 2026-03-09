import { MockStockItemRepository } from "../data/mock-stock-item-repo";
import { Id } from "@pharmacore/shared";
import { FindAllStockItem, StockItem } from "../../src";

describe("FindAllStockItem", () => {
	let usecase: FindAllStockItem;
	let stockItemRepository: MockStockItemRepository;
	let stockId: string;

	beforeEach(() => {
		stockItemRepository = new MockStockItemRepository();
		usecase = new FindAllStockItem(stockItemRepository);
		stockId = Id.tryCreate(undefined).instance.value;
	});

	test("should find all stock items successfully", async () => {
		const item1 = StockItem.tryCreate({
			stockId,
			sku: "SKU001",
			name: "Product A",
		}).instance;

		const item2 = StockItem.tryCreate({
			stockId,
			sku: "SKU002",
			name: "Product B",
		}).instance;

		if (item1 && item2) {
			stockItemRepository.stockItems.push(item1, item2);
		}

		const result = await usecase.execute();

		expect(result.isOk).toBe(true);
		expect(result.instance).toHaveLength(2);
		expect(result.instance?.[0]).toBeInstanceOf(StockItem);
		expect(result.instance?.[1]).toBeInstanceOf(StockItem);
	});

	test("should return an empty array if no stock items exist", async () => {
		const result = await usecase.execute();

		expect(result.isOk).toBe(true);
		expect(result.instance).toHaveLength(0);
	});
});
