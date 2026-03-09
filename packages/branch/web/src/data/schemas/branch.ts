import { Name, Text } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

const addressSchema = v.defineObject({
    street: { vo: Text, config: { minLength: 1, maxLength: 255 } },
    number: { vo: Text, optional: true as const, config: { minLength: 0, maxLength: 20 } },
    complement: { vo: Text, optional: true as const, config: { minLength: 0, maxLength: 255 } },
    neighborhood: { vo: Text, optional: true as const, config: { minLength: 0, maxLength: 100 } },
    city: { vo: Text, config: { minLength: 1, maxLength: 100 } },
    state: { vo: Text, config: { minLength: 2, maxLength: 2 } },
    zip: { vo: Text, config: { minLength: 5, maxLength: 20 } },
    country: { vo: Text, config: { minLength: 2, maxLength: 100 } },
});

export const createBranchSchema = v.defineObject({
    name: Name,
    address: addressSchema,
});

export type CreateBranchFormData = v.infer<typeof createBranchSchema> & { isActive: boolean };

export const updateBranchSchema = createBranchSchema;

export type UpdateBranchFormData = v.infer<typeof updateBranchSchema> & { isActive: boolean };
