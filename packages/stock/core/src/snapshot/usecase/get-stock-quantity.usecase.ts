import { Result, UseCase } from "@pharmacore/shared";
import { SnapshotRepository } from "../provider/snapshot.repository";
import { MovementRepository } from "../../movement";
import { StockCalculator } from "../../service";
import { Snapshot } from "../model/snapshot.entity";

export interface GetStockQuantityProps {
	sku: string;
}

export class GetStockQuantity implements UseCase<
	GetStockQuantityProps,
	Snapshot
> {
	constructor(
		private readonly repo: SnapshotRepository,
		private readonly repoMovement: MovementRepository,
	) {}

	async execute(data: GetStockQuantityProps): Promise<Result<Snapshot>> {
		const snapshotResult = await this.repo.findLatestForStockItem(data.sku);

		const movementsResult = snapshotResult.isOk
			? await this.repoMovement.findAllForStockItemAfter(
					data.sku,
					snapshotResult.instance.processedAt,
				)
			: await this.repoMovement.findAllForStockItem(data.sku);

		if (movementsResult.isFailure) {
			return movementsResult.withFail;
		}

		const quantity = StockCalculator.execute({
			movements: movementsResult.instance,
			snapshot: snapshotResult.instance,
		});

		const result = Snapshot.tryCreate({
			quantity,
			processedAt: new Date(),
			skuItem: data.sku,
		});

		if (result.isFailure) {
			return Result.fail(result.errors!);
		}

		return result;
	}
}
