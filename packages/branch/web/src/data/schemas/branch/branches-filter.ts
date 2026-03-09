import { Text } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const branchesFilterSchema = v.defineObject({
    name: {
        vo: Text,
        optional: true,
        config: { minLength: 0, maxLength: 100 },
    },
});

export type BranchesFilterFormData = v.infer<typeof branchesFilterSchema>;
