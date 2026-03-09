import { Result, UseCase } from "@pharmacore/shared";
import { MovementRepository } from "../provider/movement.repository";
import { Movement } from "../model/movement.entity";
import { StockItem, StockItemRepository } from "../../stock-item";
import { MovementReason } from "../model/movement-reason.enum";
import { SnapshotRepository } from "../../snapshot";
import { StockCalculator } from "../../service";
import { StockError } from "../../stock";
import { MovementIn } from "../dto";

export interface MovementOutInput extends MovementIn {}

export class CreateMovementOut implements UseCase<MovementOutInput, void> {
	constructor(
		private readonly repo: MovementRepository,
		private readonly stockItemRepo: StockItemRepository,
		private readonly snaphotRepo: SnapshotRepository,
	) {}

	async execute(data: MovementOutInput): Promise<Result<void>> {
		const { sku, stockId, quantity, reason } = data;

		if (quantity <= 0) {
			return Result.fail(StockError.INVALID_QUANTITY);
		}

		let stockItem: StockItem;
		const stockItemResult = await this.stockItemRepo.findByStockAndSku(
			stockId,
			sku,
		);
		if (stockItemResult.isFailure) {
			return Result.fail(StockError.NOT_FOUND);
		}
		stockItem = stockItemResult.instance;

		const snapResult = await this.snaphotRepo.findLatestForStockItem(sku);

		let movementsResult: Result<Movement[]>;
		if (snapResult.isOk && snapResult.instance) {
			movementsResult = await this.repo.findAllForStockItemAfter(
				sku,
				snapResult.instance.processedAt,
			);
		} else {
			movementsResult = await this.repo.findAllForStockItem(sku);
		}

		if (movementsResult.isFailure) {
			return Result.fail(movementsResult.errors!);
		}

		const movements = movementsResult.instance;
		const currentStock = StockCalculator.execute({
			movements,
			snapshot: snapResult.instance,
		});

		if (currentStock < quantity) {
			return Result.fail(StockError.INSUFFICIENT_STOCK);
		}

		const movementResult = Movement.createMovementOut({
			skuItem: stockItem.id,
			quantity,
			reason,
		});

		if (movementResult.isFailure) {
			return Result.fail(movementResult.errors!);
		}

		return this.repo.create(movementResult.instance);
	}
}
