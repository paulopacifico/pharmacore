import { Result } from "@pharmacore/shared";
import { ProductDetailsDTO } from "../dto";

export interface FindProductDetailsByAliasQuery {
    execute(alias: string): Promise<Result<ProductDetailsDTO | null>>;
}
