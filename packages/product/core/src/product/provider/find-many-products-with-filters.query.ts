import { Result } from "@pharmacore/shared";
import { ProductListDTO, ProductQueryDTO } from "../dto";

export interface FindManyProductsWithFiltersQuery {
    execute(filters: ProductQueryDTO): Promise<Result<ProductListDTO>>;
}
