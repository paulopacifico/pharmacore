import { FindAllStock, Stock, Location } from "../../src/";
import { MockStockRepository } from "../data/mock-stock-repo";
import { Id } from "@pharmacore/shared";

describe("FindAllStock", () => {
	let usecase: FindAllStock;
	let stockRepository: MockStockRepository;
	let existingLocation: Location;

	beforeEach(() => {
		stockRepository = new MockStockRepository();
		usecase = new FindAllStock(stockRepository);

		existingLocation = Location.create({
			id: Id.tryCreate(undefined).instance.value,
			name: "Central Location",
			address: "100 Main St",
			isActive: true,
		});
	});

	test("should find all stocks successfully", async () => {
		const stock1 = Stock.tryCreate({
			name: "Warehouse A",
			location: existingLocation.props,
		}).instance;
		const stock2 = Stock.tryCreate({
			name: "Warehouse B",
			location: existingLocation.props,
		}).instance;

		if (stock1 && stock2) {
			stockRepository.stocks.push(stock1, stock2);
		}

		const result = await usecase.execute();

		expect(result.isOk).toBe(true);
		expect(result.instance).toHaveLength(2);
		expect(result.instance?.[0]).toBeInstanceOf(Stock);
		expect(result.instance?.[1]).toBeInstanceOf(Stock);
	});

	test("should return an empty array if no stocks exist", async () => {
		const result = await usecase.execute();

		expect(result.isOk).toBe(true);
		expect(result.instance).toHaveLength(0);
	});
});
