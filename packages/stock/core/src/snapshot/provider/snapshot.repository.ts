import { Result, CreateRepository } from "@pharmacore/shared";
import { Snapshot } from "../model/snapshot.entity";

export interface SnapshotRepository extends CreateRepository<Snapshot> {
  findLatestForStockItem(sku: string): Promise<Result<Snapshot>>;
}
