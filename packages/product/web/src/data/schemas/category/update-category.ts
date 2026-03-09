import { v } from "@pharmacore/shared-web";
import { Alias, Id, SubCategoryName } from "@pharmacore/shared";
import { CategoryName } from "@pharmacore/product";

export const UpdateCategorySchema = v.defineObject({
    name: { vo: CategoryName, optional: true },
    alias: { vo: Alias, optional: true },
    subcategories: v.defineArray({
        name: SubCategoryName,
        id: { vo: Id, optional: true },
        alias: { vo: Alias, optional: true },
    }),
});

export type UpdateCategoryFormData = v.infer<typeof UpdateCategorySchema>;
