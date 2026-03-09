import { Email, Name, StrongPassword } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

export const registerSchema = v
    .defineObject({
        name: Name,
        email: Email,
        password: StrongPassword,
        confirmPassword: StrongPassword,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem.",
        field: "confirmPassword",
    });

export type RegisterFormData = v.infer<typeof registerSchema>;
