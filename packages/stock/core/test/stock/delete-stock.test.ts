import { DeleteStock, Stock, StockError, Location } from "../../src";
import { MockStockRepository } from "../data/mock-stock-repo";
import { Id } from "@pharmacore/shared";

describe("DeleteStock", () => {
	let usecase: DeleteStock;
	let stockRepository: MockStockRepository;
	let existingStock: Stock;
	let existingLocation: Location;

	beforeEach(() => {
		stockRepository = new MockStockRepository();
		usecase = new DeleteStock(stockRepository);

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

	test("should delete a stock successfully", async () => {
		const input = { id: existingStock.id };

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		expect(stockRepository.stocks).toHaveLength(0);
	});

	test("should fail if stock is not found", async () => {
		const nonExistentId = "non-existent-id";
		const input = { id: nonExistentId };

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(result.errors?.[0]).toEqual(StockError.NOT_FOUND);
		expect(stockRepository.stocks).toHaveLength(1); // Should not have deleted anything
	});
});
