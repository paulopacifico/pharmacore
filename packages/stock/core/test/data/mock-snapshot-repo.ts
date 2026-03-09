import { Result } from "@pharmacore/shared";
import { Snapshot, SnapshotRepository, StockError } from "../../src/";

export class MockSnapshotRepository implements SnapshotRepository {
	public snapshots: Snapshot[] = [];

	async create(snapshot: Snapshot): Promise<Result<void>> {
		this.snapshots.push(snapshot);
		return Promise.resolve(Result.ok(undefined));
	}

	async findLatestForStockItem(sku: string): Promise<Result<Snapshot>> {
		const stockItemSnapshots = this.snapshots
			.filter((s) => s.skuItem === sku)
			.sort((a, b) => b.processedAt.getTime() - a.processedAt.getTime());

		const snapshot = stockItemSnapshots[0] || null;

		if (!snapshot) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}

		return Promise.resolve(Result.ok(snapshot));
	}

	reset() {
		this.snapshots = [];
	}
}
