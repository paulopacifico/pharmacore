import { getErrorMessage } from "../../../utils/api-error";

export function formatRequiredError(): { type: string; message: string } {
    return {
        type: "required",
        message: getErrorMessage({ errors: ["REQUIRED_FIELD"] }),
    };
}

export function refinementValidationError(message: string): {
    type: string;
    message: string;
} {
    return {
        type: "refinement",
        message,
    };
}

export function formatValidationError(errors?: string[]): {
    type: string;
    message: string;
} {
    return {
        type: "validation",
        message: getErrorMessage({ errors }) || "Valor inválido",
    };
}

export function formatInvalidTypeError(message: string): {
    type: string;
    message: string;
} {
    return { type: "invalid_type", message };
}

export function formatMinError(min: number): { type: string; message: string } {
    return {
        type: "min",
        message: `Mínimo de ${min} itens`,
    };
}

export function formatMaxError(max: number): { type: string; message: string } {
    return {
        type: "max",
        message: `Máximo de ${max} itens`,
    };
}
