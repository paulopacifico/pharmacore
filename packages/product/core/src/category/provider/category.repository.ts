import { CrudRepository } from "@pharmacore/shared";
import { Category } from "../model/category.entity";

export interface CategoryRepository extends CrudRepository<Category> {}
