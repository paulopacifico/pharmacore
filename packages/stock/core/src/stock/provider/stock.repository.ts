import { CrudRepository } from "@pharmacore/shared";
import { Stock } from "../model/stock.entity";

export interface StockRepository extends CrudRepository<Stock> {}
