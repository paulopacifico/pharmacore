import { Result, UseCase } from "@pharmacore/shared";
import { StockRepository } from "../provider/stock.repository";
import { StockOut } from "../dto";

export interface FindAllStockOut extends Array<StockOut> {}

export class FindAllStock implements UseCase<void, FindAllStockOut> {
    constructor(private readonly repo: any) {} //todo implementar query

    async execute(): Promise<Result<FindAllStockOut>> {
        const result = await this.repo.findAll();
        if (result.isFailure) {
            return result.withFail;
        }

        return Result.ok(result.instance);
    }
}
