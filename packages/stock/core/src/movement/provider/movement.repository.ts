import { Result } from "@pharmacore/shared";
import { CreateRepository } from "@pharmacore/shared";
import { Movement } from "../model/movement.entity";

export interface MovementRepository extends CreateRepository<Movement> {
  findAllForStockItem(sku: string): Promise<Result<Movement[]>>;
  findAllForStockItemAfter(
    sku: string,
    date: Date,
  ): Promise<Result<Movement[]>>;
}
