import { PaginatedResultDTO } from "@pharmacore/shared";
import { ProductProps } from "../model/product.entity";

export interface ProductListItem extends Omit<
    ProductProps,
    "subcategoryId" | "brandId" | "characteristics"
> {
    formattedPrice?: string;
}

export type ProductListDTO = PaginatedResultDTO<ProductListItem>;
