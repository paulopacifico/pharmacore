import { CreateStock } from "../../src/stock";
import { MockStockRepository } from "../data/mock-stock-repo";
import { MockLocationRepository } from "../data/mock-location-repo";
import { Stock } from "../../src/stock/model/stock.entity";
import { Location } from "../../src/location/model/location.entity";
import { Id, Result } from "@pharmacore/shared";

describe("CreateStock", () => {
	let usecase: CreateStock;
	let stockRepository: MockStockRepository;
	let locationRepository: MockLocationRepository;
	let existingLocation: Location;

	beforeEach(() => {
		stockRepository = new MockStockRepository();
		locationRepository = new MockLocationRepository();
		usecase = new CreateStock(stockRepository, locationRepository);

		existingLocation = Location.create({
			id: Id.tryCreate(undefined).instance.value,
			name: "Central Location",
			address: "100 Main St",
			isActive: true,
		});
		locationRepository.locations.push(existingLocation);
	});

	test("should create a stock successfully", async () => {
		const input = {
			name: "Main Warehouse Stock",
			locationId: existingLocation.id,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Stock);
		// expect(result.instance?.name).toBe("Main Warehouse Stock");
		// expect(result.instance?.location.id).toBe(existingLocation.id);
		expect(stockRepository.stocks).toHaveLength(1);
		// expect(stockRepository.stocks?.[0]?.id).toBe(result.instance?.id);
	});

	test("should fail if stock name is too short", async () => {
		const input = {
			name: "MW",
			locationId: existingLocation.id,
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(stockRepository.stocks).toHaveLength(0);
	});
});
