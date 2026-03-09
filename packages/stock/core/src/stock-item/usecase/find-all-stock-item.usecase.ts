import { Result, UseCase } from "@pharmacore/shared";
import { StockItem } from "../model/stock-item.entity";
import { StockItemRepository } from "../provider/stock-item.repository";

export interface FindAllStockItemsOut extends Array<StockItem> {}

export class FindAllStockItem implements UseCase<void, FindAllStockItemsOut> {
    constructor(private readonly repo: any) {} //todo implementar query

    async execute(): Promise<Result<FindAllStockItemsOut>> {
        const result = await this.repo.findAll();
        if (result.isFailure) {
            return result.withFail;
        }

        return Result.ok(result.instance);
    }
}
