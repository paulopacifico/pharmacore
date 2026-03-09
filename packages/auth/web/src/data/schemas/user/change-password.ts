import { StrongPassword, Text } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";
import { z } from "zod";

export const changePasswordSchema = v
    .defineObject({
        oldPassword: Text,
        newPassword: StrongPassword,
        confirmPassword: StrongPassword,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        field: "confirmPassword",
        message: "As senhas não coincidem.",
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        field: "newPassword",
        message: "A nova senha não pode ser igual a antiga.",
    });

export type ChangePasswordFormData = v.infer<typeof changePasswordSchema>;
