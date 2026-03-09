const ERROR_MESSAGES: Record<string, string> = {
    // User errors
    USER_NOT_FOUND: "Usuário não encontrado.",
    USER_EMAIL_ALREADY_EXISTS: "E-mail já cadastrado.",
    USER_INVALID_CREDENTIALS:
        "Credenciais inválidas. Verifique seu e-mail e senha.",
    USER_UNAUTHORIZED: "Não autorizado. Faça login novamente.",
    USER_ACCESS_DENIED:
        "Acesso negado. Você não tem permissão para realizar esta ação.",
    MUST_HAVE_FIRST_AND_LAST_NAME: "Nome e sobrenome são obrigatórios.",

    // Password errors
    PASSWORD_MISMATCH: "Usuário ou senha incorretos",
    WEAK_PASSWORD:
        "Mín. 8 caracteres, com maiúscula, minúscula, número e símbolo (ex.: Strong@123).",

    // Role errors
    ROLE_NOT_FOUND: "Perfil de usuário não encontrado.",
    ROLE_NAME_ALREADY_EXISTS: "Nome do perfil de usuário já existe.",

    // Permission errors
    PERMISSION_NOT_FOUND: "Permissão não encontrada.",
    PERMISSION_ACCESS_DENIED:
        "Acesso negado. Você não tem permissão para realizar esta ação.",

    // Branch errors
    BRANCH_NOT_FOUND: "Filial não encontrada.",
    NAME_TOO_SHORT: "Nome deve ter pelo menos 3 caracteres.",
    NAME_TOO_LONG: "Nome deve ter no máximo 50 caracteres.",
    INVALID_CNPJ: "CNPJ inválido.",
    INVALID_BOOLEAN: "Valor inválido.",
    INVALID_DATE: "Data inválida.",
    TEXT_TOO_SHORT: "Texto muito curto.",
    TEXT_TOO_LONG: "Texto muito longo.",

    // Product errors
    PRODUCT_NOT_FOUND: "Produto não encontrado.",
    PRODUCT_NAME_TOO_SHORT:
        "Nome do produto é muito pequeno (mínimo de 5 caracteres).",
    PRODUCT_NAME_TOO_LONG:
        "Nome do produto é muito grande (máximo de 50 caracteres).",
    CATEGORY_NAME_TOO_SHORT:
        "Nome da categoria é muito pequeno (mínimo de 5 caracteres).",
    CATEGORY_NAME_TOO_LONG:
        "Nome da categoria é muito grande (máximo de 50 caracteres).",
    SUB_CATEGORY_NAME_TOO_SHORT:
        "Nome da sub categoria é muito pequeno (mínimo de 5 caracteres).",
    SUB_CATEGORY_NAME_TOO_LONG:
        "Nome da sub categoria é muito grande (máximo de 50 caracteres).",

    // Category errors
    CATEGORY_NOT_FOUND: "Categoria não encontrada.",
    CATEGORIES_NOT_FOUND: "Categorias não encontradas.",

    // Subcategory errors
    SUBCATEGORY_NOT_FOUND: "Subcategoria não encontrada.",
    PARENT_CATEGORY_NOT_FOUND: "Categoria pai não encontrada.",
    SUBCATEGORIES_NOT_FOUND: "Subcategorias não encontradas.",

    // Stock errors
    INSUFFICIENT_STOCK: "Estoque insuficiente para realizar esta operação.",
    INVALID_QUANTITY: "Quantidade inválida.",
    INVALID_MOVEMENT: "Movimentação de estoque inválida.",
    NOT_FOUND: "Registro não encontrado.",

    // Erros específicos
    SHORT_DESCRIPTION_TOO_SHORT:
        "Descrição é muito curta (mínimo de 18 caracteres).",
    DESCRIPTION_TOO_SHORT: "Descrição é muito curta (mínimo de 20 caracteres).",
    PRICE_TOO_SMALL: "O preço informado não pode ser negativo.",
    INVALID_SKU: "O SKU informado não segue o formato esperado.",

    // Mensagens arbitrárias
    REQUIRED_FIELD: "Campo com preenchimento obrigatório",
    INVALID_ID: "ID inválido. Verifique os dados e tente novamente.",

    DEFAULT_API_ERROR:
        "Ocorreu um erro inesperado na comunicação com o servidor.",
} as const;

export function getErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        Array.isArray((error as any).errors)
    ) {
        return (error as any).errors
            .map(
                (code: string) =>
                    ERROR_MESSAGES[code] || `Erro desconhecido: ${code}`,
            )
            .join(", ");
    }

    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as any).response;
        const data = response?.data;

        if (Array.isArray(data?.errors) && data.errors.length > 0) {
            return data.errors
                .map(
                    (code: string) =>
                        ERROR_MESSAGES[code] || `Erro desconhecido: ${code}`,
                )
                .join(", ");
        }

        if (Array.isArray(data?.message) && data.message.length > 0) {
            return data.message
                .map(
                    (code: string) =>
                        ERROR_MESSAGES[code] || `Erro desconhecido: ${code}`,
                )
                .join(", ");
        }

        if (typeof data?.message === "string") {
            return data.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return ERROR_MESSAGES.DEFAULT_API_ERROR!;
}
