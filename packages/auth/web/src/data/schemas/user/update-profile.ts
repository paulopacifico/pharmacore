import { Email, Name } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const updateProfileSchema = v.defineObject({
    name: Name,
    email: Email,
});

export type UpdateProfileFormData = v.infer<typeof updateProfileSchema>;
