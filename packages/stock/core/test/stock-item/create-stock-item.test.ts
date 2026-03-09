import { CreateStockItem } from "../../src/";
import { MockStockItemRepository } from "../data/mock-stock-item-repo";
import { Id } from "@pharmacore/shared";

describe("CreateStockItem", () => {
	let usecase: CreateStockItem;
	let stockItemRepository: MockStockItemRepository;
	let stockId: string;

	beforeEach(() => {
		stockItemRepository = new MockStockItemRepository();
		usecase = new CreateStockItem(stockItemRepository);
		stockId = Id.tryCreate(undefined).instance.value;
	});

	test("should create a stock item successfully with a name", async () => {
		const input = {
			stockId,
			sku: "SKU001",
			name: "Product A",
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(StockItem);
		// expect(result.instance?.name).toBe("Product A");
		// expect(result.instance?.sku).toBe("SKU001");
		// expect(result.instance?.stockId).toBe(stockId);
		expect(stockItemRepository.stockItems).toHaveLength(1);
	});

	test("should create a stock item successfully without a name", async () => {
		const input = {
			stockId,
			sku: "SKU002",
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(StockItem);
		// expect(result.instance?.name).toBeUndefined();
		// expect(result.instance?.sku).toBe("SKU002");
		// expect(result.instance?.stockId).toBe(stockId);
		expect(stockItemRepository.stockItems).toHaveLength(1);
	});

	test("should fail if SKU is invalid", async () => {
		const input = {
			stockId,
			sku: "INVALID SKU",
			name: "Product C",
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(stockItemRepository.stockItems).toHaveLength(0);
	});

	test("should fail if stockId is empty", async () => {
		const input = {
			stockId: "",
			sku: "SKU004",
			name: "Product D",
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(stockItemRepository.stockItems).toHaveLength(0);
	});
});
