import { CreateLocation } from "../../src/location";
import { MockLocationRepository } from "../data/mock-location-repo";
import { Location } from "../../src/location/model/location.entity";

describe("CreateLocation", () => {
	let usecase: CreateLocation;
	let repository: MockLocationRepository;

	beforeEach(() => {
		repository = new MockLocationRepository();
		usecase = new CreateLocation(repository);
	});

	test("should create a location successfully", async () => {
		const input = {
			name: "Main Warehouse",
			address: "123 Main St",
			isActive: true,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Location);
		// expect(result.instance?.name).toBe("Main Warehouse");
		// expect(result.instance?.address).toBe("123 Main St");
		expect(repository.locations).toHaveLength(1);
		// expect(repository?.locations?.[0]?.id).toBe(result.instance?.id);
	});

	test("should fail if location name is too short", async () => {
		const input = {
			name: "MW",
			address: "123 Main St",
			isActive: true,
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(repository.locations).toHaveLength(0);
	});

	test("should create a location successfully even if isActive is not provided", async () => {
		const input = {
			name: "Secondary Warehouse",
			address: "456 Oak Ave",
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Location);
		// expect(result.instance?.name).toBe("Secondary Warehouse");
		// expect(result.instance?.address).toBe("456 Oak Ave");
		// expect(result.instance?.isActive).toBe(true);
		expect(repository.locations).toHaveLength(1);
	});
});
