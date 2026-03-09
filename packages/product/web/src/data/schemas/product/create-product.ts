import { ProductCharacteristic, ProductName } from "@pharmacore/product";
import {
    Alias,
    Description,
    Id,
    Name,
    Price,
    Sku,
    URL,
} from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const createProductSchema = v.defineObject({
    name: ProductName,
    description: {
        vo: Description,
        config: {
            minLength: 10,
            maxLength: Number.MAX_SAFE_INTEGER,
        },
    },
    alias: Alias,
    price: {
        vo: Price,
        config: {
            minValue: 1,
        },
    },
    sku: Sku,
    imagesURL: v.defineArray(URL),
    brand: v.defineObject({
        id: Id,
        name: Name,
    }),
    category: v.defineObject({
        id: Id,
        name: Name,
    }),
    subcategory: v.defineObject({
        id: Id,
        name: Name,
    }),
    characteristics: v.defineArray(ProductCharacteristic),
});

export type CreateProductFormData = v.infer<typeof createProductSchema>;
