import { Result } from "@pharmacore/shared";
import { SubcategoryListDTO } from "../dto/subcategory-list.dto";

export interface FindSubcategoriesByCategoryIdQuery {
	execute(id: string): Promise<Result<SubcategoryListDTO>>;
}
