import { Result } from "@pharmacore/shared";
import { CategoryListDTO } from "../dto";

export interface FindManyCategoriesQuery {
	execute({
		getSubcategories,
	}: {
		getSubcategories?: boolean;
	}): Promise<Result<CategoryListDTO>>;
}
