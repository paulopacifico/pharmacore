import { MockStockRepository } from "../data/mock-stock-repo";
import { Stock, StockError, FindStockById, Location } from "../../src";
import { Id } from "@pharmacore/shared";

describe("FindStockById", () => {
	let usecase: FindStockById;
	let stockRepository: MockStockRepository;
	let existingStock: Stock;
	let existingLocation: Location;

	beforeEach(() => {
		stockRepository = new MockStockRepository();
		usecase = new FindStockById(stockRepository);

		existingLocation = Location.create({
			id: Id.tryCreate(undefined).instance.value,
			name: "Central Location",
			address: "100 Main St",
			isActive: true,
		});

		const stockResult = Stock.tryCreate({
			name: "Main Warehouse Stock",
			location: existingLocation.props,
		});

		if (stockResult.isOk) {
			existingStock = stockResult.instance;
			stockRepository.stocks.push(existingStock);
		}
	});

	test("should find a stock by id successfully", async () => {
		const input = { id: existingStock.id };

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		expect(result.instance).toBeInstanceOf(Stock);
		expect(result.instance?.id).toBe(existingStock.id);
	});

	test("should fail if stock is not found", async () => {
		const nonExistentId = "non-existent-id";
		const input = { id: nonExistentId };

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(result.errors?.[0]).toEqual(StockError.NOT_FOUND);
	});
});
