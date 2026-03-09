import { CrudRepository } from "@pharmacore/shared";
import { Product } from "../model/product.entity";

export interface ProductRepository extends CrudRepository<Product> {}
