import { Result } from "@pharmacore/shared";

export interface SubcategoryExistenceChecker {
	subcategoryExists(id: string): Promise<Result<boolean>>;
}
