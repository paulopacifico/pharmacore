import { CategoryName } from "@pharmacore/product";
import { Alias, Id, SubCategoryName } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const createCategorySchema = v.defineObject({
    name: CategoryName,
    alias: Alias,
    subcategories: v.defineArray({
        name: SubCategoryName,
        id: { vo: Id, optional: true },
        alias: Alias,
    }),
});

export type CreateCategoryFormData = v.infer<typeof createCategorySchema>;
