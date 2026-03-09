import { Id, Name, PermissionId, ShortDescription } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const editRoleSchema = v.defineObject({
    id: Id,
    name: Name,
    description: ShortDescription,
    permissionIds: v.defineArray(PermissionId, { optional: true }),
});

export type EditRoleFormData = v.infer<typeof editRoleSchema>;
