import { CrudRepository } from "@pharmacore/shared";
import { Brand } from "../model/brand.entity";

export interface BrandRepository extends CrudRepository<Brand> {}
