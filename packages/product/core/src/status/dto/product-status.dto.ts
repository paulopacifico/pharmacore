import { CategorySubcategoryRelationDTO } from "./category-subcategory-relation.dto";
import { KpiDTO } from "./kpi.dto";
import { RecentProductsDTO } from "./recent-products.dto";

export interface ProductStatusDTO {
    kpi: KpiDTO;
    categories: CategorySubcategoryRelationDTO[];
    lastCreatedProducts: RecentProductsDTO;
    lastDeletedProducts: RecentProductsDTO;
}
