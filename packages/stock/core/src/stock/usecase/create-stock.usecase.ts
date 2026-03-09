import { Result, UseCase } from "@pharmacore/shared";
import { Stock } from "../model/stock.entity";
import { StockRepository } from "../provider/stock.repository";
import { LocationRepository } from "../../location";

export interface CreateStockIn {
	name: string;
	locationId: string;
}

export class CreateStock implements UseCase<CreateStockIn, void> {
	constructor(
		private readonly stockRepo: StockRepository,
		private readonly locationRepo: LocationRepository,
	) {}

	async execute(data: CreateStockIn): Promise<Result<void>> {
		const location = await this.locationRepo.findById(data.locationId);
		if (location.isFailure) {
			return Result.fail(location.errors!);
		}

		const stockResult = Stock.tryCreate({
			name: data.name,
			location: location.instance.props,
		});

		if (stockResult.isFailure) {
			return Result.fail(stockResult.errors!);
		}

		return this.stockRepo.create(stockResult.instance);
	}
}
