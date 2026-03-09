import { Name } from "@pharmacore/shared";
import { Alias } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const updateBrandSchema = v.defineObject({
    name: { vo: Name, optional: true },
    alias: { vo: Alias, optional: true },
});

export type UpdateBrandFormData = v.infer<typeof updateBrandSchema>;
