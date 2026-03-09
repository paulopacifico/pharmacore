import { ProductProps } from "../model/product.entity";
import { ProductCharacteristicProps } from "../model/product-characteristic.vo";

export interface ProductDetailsDTO extends Omit<
    ProductProps,
    "subcategoryId" | "brandId"
> {
    formattedPrice?: string;
    category: { id: string; name: string };
    subcategory: { id: string; name: string };
    brand: { id: string; name: string };
    characteristics: ProductCharacteristicProps[];
}
