import { Result, ValueObject, ValueObjectConfig } from "../base";

export class Cpf extends ValueObject<string, ValueObjectConfig> {
    private static readonly INVALID_CPF = "INVALID_CPF";

    private constructor(value: string, config?: ValueObjectConfig) {
        super(value, config);
    }

    get formatted(): string {
        const digits = this.value;
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }

    get checkDigits(): string {
        return this.value.slice(9, 11);
    }

    get baseDigits(): string {
        return this.value.slice(0, 9);
    }

    public hasSameRoot(cpf: Cpf): boolean {
        return this.baseDigits === cpf.baseDigits;
    }

    public static create(value: string, config?: ValueObjectConfig): Cpf {
        const result = Cpf.tryCreate(value, config);
        result.throwIfFailed();
        return result.instance;
    }

    public static tryCreate(
        value: string,
        config?: ValueObjectConfig,
    ): Result<Cpf> {
        try {
            const digits = Cpf.extractDigits(value);

            if (digits.length !== 11) {
                throw new Error(Cpf.INVALID_CPF);
            }

            if (/^(\d)\1{10}$/.test(digits)) {
                throw new Error(Cpf.INVALID_CPF);
            }

            if (!Cpf.hasValidCheckDigits(digits)) {
                throw new Error(Cpf.INVALID_CPF);
            }

            return Result.ok(new Cpf(digits, config));
        } catch (error: any) {
            return Result.fail(error.message);
        }
    }

    private static extractDigits(value: string): string {
        return (value ?? "").replace(/\D/g, "");
    }

    private static hasValidCheckDigits(digits: string): boolean {
        const firstDigit = Cpf.calculateCheckDigit(digits.slice(0, 9), 10);
        const secondDigit = Cpf.calculateCheckDigit(
            `${digits.slice(0, 9)}${firstDigit}`,
            11,
        );

        return digits.endsWith(`${firstDigit}${secondDigit}`);
    }

    private static calculateCheckDigit(cpfBase: string, initialWeight: number): number {
        const total = cpfBase
            .split("")
            .reduce(
                (sum, currentDigit, index) =>
                    sum + Number(currentDigit) * (initialWeight - index),
                0,
            );

        const remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }
}
