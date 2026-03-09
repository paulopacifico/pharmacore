import { Result } from "@pharmacore/shared";
import { BrandListDTO, BrandQueryDTO } from "../dto";

export interface FindManyBrandsQuery {
    execute(filters: BrandQueryDTO): Promise<Result<BrandListDTO>>;
}
