import { Movement, MovementRepository } from "../../src/movement";
import { Result } from "@pharmacore/shared";

export class MockMovementRepository implements MovementRepository {
	findAllForStockItem(sku: string): Promise<Result<Movement[]>> {
		const results = this.movements.filter((m) => m.skuItem === sku);
		return Promise.resolve(Result.ok(results));
	}
	findAllForStockItemAfter(
		sku: string,
		date: Date,
	): Promise<Result<Movement[]>> {
		const results = this.movements.filter(
			(m) => m.skuItem === sku && m.createdAt > date,
		);
		return Promise.resolve(Result.ok(results));
	}
	public movements: Movement[] = [];

	async create(movement: Movement): Promise<Result<void>> {
		this.movements.push(movement);
		return Promise.resolve(Result.ok(undefined));
	}

	async findByStockItem(id: string): Promise<Movement[]> {
		const items = this.movements.filter((m) => m.skuItem === id);
		return Promise.resolve(items);
	}

	reset() {
		this.movements = [];
	}
}
