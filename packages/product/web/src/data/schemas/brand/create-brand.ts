import { Name } from "@pharmacore/shared";
import { Alias } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const createBrandSchema = v.defineObject({
    name: Name,
    alias: Alias,
});

export type CreateBrandFormData = v.infer<typeof createBrandSchema>;
