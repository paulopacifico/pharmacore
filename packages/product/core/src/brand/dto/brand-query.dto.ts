import { PaginatedInputDTO } from "@pharmacore/shared";
import { BrandFiltersDTO } from "./brand-filters.dto";

export type BrandQueryDTO = PaginatedInputDTO & BrandFiltersDTO;
