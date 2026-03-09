import { PaginatedInputDTO } from "@pharmacore/shared";
import { ProductFiltersDTO } from "./product-filters.dto";

export type ProductQueryDTO = PaginatedInputDTO & ProductFiltersDTO;
