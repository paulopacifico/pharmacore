import { Email, Id, Name } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const editUserSchema = v.defineObject({
    id: Id,
    name: Name,
    email: Email,
    roleIds: v.defineArray(Id, { min: 1 }),
});

export type EditUserFormData = v.infer<typeof editUserSchema>;
