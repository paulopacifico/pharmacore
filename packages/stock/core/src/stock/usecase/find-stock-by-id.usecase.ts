import { Result, UseCase } from "@pharmacore/shared";
import { Stock } from "../model/stock.entity";
import { StockRepository } from "../provider/stock.repository";

import { StockIn } from "../dto";

export interface FindStockByIdIn extends StockIn {}
export class FindStockById implements UseCase<FindStockByIdIn, Stock> {
	constructor(private readonly repo: StockRepository) {}

	async execute({ id }: FindStockByIdIn): Promise<Result<Stock>> {
		const result = await this.repo.findById(id);
		if (result.isFailure) {
			return result.withFail;
		}

		return Result.ok(result.instance);
	}
}
