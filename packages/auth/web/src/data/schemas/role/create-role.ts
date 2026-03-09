import { Name, PermissionId, ShortDescription } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const createRoleSchema = v.defineObject({
    name: Name,
    description: ShortDescription,
    permissionIds: v.defineArray(PermissionId, { optional: true }),
});

export type CreateRoleFormData = v.infer<typeof createRoleSchema>;
