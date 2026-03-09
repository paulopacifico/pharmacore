import { MockStockItemRepository } from "../data/mock-stock-item-repo";
import { Id } from "@pharmacore/shared";
import { StockError, FindStockItemByStockAndSku, StockItem } from "../../src";

describe("FindStockItemByStockAndSku", () => {
	let usecase: FindStockItemByStockAndSku;
	let stockItemRepository: MockStockItemRepository;
	let existingStockItem: StockItem;
	let stockId: string;

	beforeEach(() => {
		stockItemRepository = new MockStockItemRepository();
		usecase = new FindStockItemByStockAndSku(stockItemRepository);
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

	test("should find a stock item by stockId and sku successfully", async () => {
		const input = { stockId, sku: "EXISTING-SKU" };

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		expect(result.instance).toBeInstanceOf(StockItem);
		expect(result.instance?.id).toBe(existingStockItem.id);
	});

	test("should fail if stock item is not found with wrong sku", async () => {
		const input = { stockId, sku: "NON-EXISTENT-SKU" };

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(result.errors?.[0]).toEqual(StockError.NOT_FOUND);
	});

	test("should fail if stock item is not found with wrong stockId", async () => {
		const wrongStockId = Id.tryCreate(undefined).instance.value;
		const input = { stockId: wrongStockId, sku: "EXISTING-SKU" };

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(result.errors?.[0]).toEqual(StockError.NOT_FOUND);
	});
});
