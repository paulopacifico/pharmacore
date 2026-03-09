import { Result, UseCase } from "@pharmacore/shared";
import { StockRepository } from "../provider/stock.repository";
import { StockIn } from "../dto";

export interface FindStockByIdInput extends StockIn {}

export class DeleteStock implements UseCase<FindStockByIdInput, void> {
	constructor(private readonly repo: StockRepository) {}

	async execute({ id }: FindStockByIdInput): Promise<Result<void>> {
		const result = await this.repo.findById(id);
		if (result.isFailure) {
			return result.withFail;
		}

		return this.repo.delete(id);
	}
}
