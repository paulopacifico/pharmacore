import { PaginatedResultDTO } from "@pharmacore/shared";
import { BrandProps } from "../model/brand.entity";

export interface BrandListItem extends BrandProps {}

export type BrandListDTO = PaginatedResultDTO<BrandListItem>;
