import { Result } from "@pharmacore/shared";
import { RecentProductsDTO } from "../dto";

export interface FindLastCreatedProductsQuery {
    execute(n: number): Promise<Result<RecentProductsDTO>>;
}
