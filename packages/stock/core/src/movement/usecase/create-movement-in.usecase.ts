import { Result, UseCase } from "@pharmacore/shared";
import { MovementRepository } from "../provider/movement.repository";
import { Movement } from "../model/movement.entity";
import { StockItemRepository, StockItem } from "../../stock-item";
import { StockError } from "../../stock";
import { MovementIn } from "../dto";

export interface MovementInInput extends MovementIn {}

export class CreateMovementIn implements UseCase<MovementInInput, void> {
	constructor(
		private readonly movementRepo: MovementRepository,
		private readonly stockItemRepo: StockItemRepository,
	) {}

	async execute(data: MovementInInput): Promise<Result<void>> {
		const { sku, stockId, quantity, reason } = data;

		if (quantity <= 0) {
			return Result.fail(StockError.INVALID_QUANTITY);
		}

		const stockItemResult = await this.stockItemRepo.findByStockAndSku(
			stockId,
			sku,
		);

		if (stockItemResult.isFailure) {
			const newStockItemResult = StockItem.tryCreate({ stockId, sku });
			if (newStockItemResult.isFailure) {
				return newStockItemResult.withFail;
			}
			const createdStockItemResult = await this.stockItemRepo.create(
				newStockItemResult.instance,
			);
			if (createdStockItemResult.isFailure) {
				return createdStockItemResult.withFail;
			}
		}

		const movementResult = Movement.createMovementIn({
			skuItem: sku,
			quantity,
			reason,
		});

		if (movementResult.isFailure) {
			return movementResult.withFail;
		}

		return this.movementRepo.create(movementResult.instance);
	}
}
