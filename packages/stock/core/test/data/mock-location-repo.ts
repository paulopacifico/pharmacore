import { StockError, Location, LocationRepository } from "../../src/";
import { Result } from "@pharmacore/shared";

export class MockLocationRepository implements LocationRepository {
	public locations: Location[] = [];

	async create(location: Location): Promise<Result<void>> {
		this.locations.push(location);
		return Promise.resolve(Result.ok(undefined));
	}

	async update(location: Location): Promise<Result<void>> {
		const index = this.locations.findIndex((l) => l.id === location.id);
		if (index === -1) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		this.locations[index] = location;
		return Promise.resolve(Result.ok(undefined));
	}

	async findById(id: string): Promise<Result<Location>> {
		const l = this.locations.find((l) => l.id === id) || null;
		if (!l) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}

		return Promise.resolve(Result.ok(l));
	}

	async findAll(): Promise<Result<Location[]>> {
		return Promise.resolve(Result.ok([...this.locations]));
	}

	async delete(id: string): Promise<Result<void>> {
		const index = this.locations.findIndex((l) => l.id === id);
		if (index === -1) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		this.locations.splice(index, 1);
		return Promise.resolve(Result.ok(undefined));
	}

	reset() {
		this.locations = [];
	}
}
