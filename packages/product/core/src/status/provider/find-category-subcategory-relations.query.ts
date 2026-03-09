import { Result } from "@pharmacore/shared";
import { CategorySubcategoryRelationDTO } from "../dto";

export interface FindCategorySubcategoryRelationsQuery {
    execute(): Promise<Result<CategorySubcategoryRelationDTO[]>>;
}
