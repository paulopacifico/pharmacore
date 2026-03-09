import { MockStockItemRepository } from "../data/mock-stock-item-repo";
import { Id } from "@pharmacore/shared";
import { StockError, FindStockItemById, StockItem } from "../../src";

describe("FindStockItemById", () => {
	let usecase: FindStockItemById;
	let stockItemRepository: MockStockItemRepository;
	let existingStockItem: StockItem;
	let stockId: string;

	beforeEach(() => {
		stockItemRepository = new MockStockItemRepository();
		usecase = new FindStockItemById(stockItemRepository);
		stockId = Id.tryCreate(undefined).instance.value;

		const stockItemResult = StockItem.tryCreate({
			stockId,
			sku: "EXISTING-SKU",
			name: "Existing Product",
		});

		if (stockItemResult.isOk) {
			existingStockItem = stockItemResult.instance;
			stockItemRepository.stockItems.push(existingStockItem);
		}
	});

	test("should find a stock item by id successfully", async () => {
		const input = { id: existingStockItem.id };

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		expect(result.instance).toBeInstanceOf(StockItem);
		expect(result.instance?.id).toBe(existingStockItem.id);
	});

	test("should fail if stock item is not found", async () => {
		const nonExistentId = "non-existent-id";
		const input = { id: nonExistentId };

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(result.errors?.[0]).toEqual(StockError.NOT_FOUND);
	});
});
