import { CrudRepository, Result } from "@pharmacore/shared";
import { StockItem } from "../model/stock-item.entity";

export interface StockItemRepository extends CrudRepository<StockItem> {
  findByStockAndSku(stockId: string, sku: string): Promise<Result<StockItem>>;
}
