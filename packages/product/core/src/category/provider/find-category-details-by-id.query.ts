import { Result } from "@pharmacore/shared";
import { CategoryDetailsDTO } from "../dto";

export interface FindCategoryDetailsByIdQuery {
	execute(
		id: string,
		{ getSubcategories }: { getSubcategories?: boolean },
	): Promise<Result<CategoryDetailsDTO>>;
}
