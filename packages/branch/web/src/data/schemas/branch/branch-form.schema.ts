import { Address, Cnpj, DateVO, Name } from "@pharmacore/shared";
import { v } from "@pharmacore/shared-web";

const BooleanVO = {
    tryCreate(val: unknown) {
        if (typeof val === "boolean") {
            return { isFailure: false, isOk: true, instance: { value: val } };
        }
        if (val === "true") {
            return { isFailure: false, isOk: true, instance: { value: true } };
        }
        if (val === "false") {
            return { isFailure: false, isOk: true, instance: { value: false } };
        }
        return { isFailure: true, isOk: false, errors: ["INVALID_BOOLEAN"] };
    },
};

export const branchFormSchema = v.defineObject({
    name: Name,
    cnpj: Cnpj,
    isActive: BooleanVO,
    establishedAt: {
        vo: DateVO,
        optional: true,
    },
    address: Address,
});

export type BranchFormData = v.infer<typeof branchFormSchema>;
