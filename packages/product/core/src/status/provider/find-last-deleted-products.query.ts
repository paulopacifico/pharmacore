import { Result } from "@pharmacore/shared";
import { RecentProductsDTO } from "../dto";

export interface FindLastDeletedProductsQuery {
    execute(n: number): Promise<Result<RecentProductsDTO>>;
}
