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

export const updateProductSchema = v.defineObject({
    name: { vo: ProductName, optional: true },
    alias: { vo: Alias, optional: true },
    description: {
        vo: Description,
        config: {
            minLength: 10,
            maxLength: Number.MAX_SAFE_INTEGER,
        },
        optional: true,
    },
    price: { vo: Price, optional: true },
    sku: { vo: Sku, optional: true },
    imagesURL: v.defineArray(URL, { optional: true }),
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
    characteristics: v.defineArray(ProductCharacteristic, { optional: true }),
});

export type UpdateProductFormData = v.infer<typeof updateProductSchema>;
