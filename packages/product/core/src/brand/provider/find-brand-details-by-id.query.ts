import { Result } from "@pharmacore/shared";
import { BrandDetailsDTO } from "../dto";

export interface FindBrandDetailsByIdQuery {
    execute(id: string): Promise<Result<BrandDetailsDTO>>;
}
