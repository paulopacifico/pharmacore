import { Email, StrongPassword } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const loginSchema = v.defineObject({
    email: Email,
    password: StrongPassword,
});

export type LoginFormData = v.infer<typeof loginSchema>;
