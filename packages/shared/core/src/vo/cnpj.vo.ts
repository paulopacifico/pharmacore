import { Result, ValueObject, ValueObjectConfig } from "../base";

export class Cnpj extends ValueObject<string, ValueObjectConfig> {
	private static readonly INVALID_CNPJ = "INVALID_CNPJ";
	private static readonly CNPJ_LENGTH = 14;

	private constructor(value: string, config?: ValueObjectConfig) {
		super(value, config);
	}

	public static create(value: string, config?: ValueObjectConfig): Cnpj {
		const result = Cnpj.tryCreate(value, config);
		result.throwIfFailed();
		return result.instance;
	}

	public static tryCreate(
		value: string,
		config?: ValueObjectConfig,
	): Result<Cnpj> {
		try {
			const digits = String(value ?? "").replace(/\D/g, "");
			if (digits.length !== Cnpj.CNPJ_LENGTH) {
				throw new Error(Cnpj.INVALID_CNPJ);
			}
			if (!/^\d{14}$/.test(digits)) {
				throw new Error(Cnpj.INVALID_CNPJ);
			}
			// Reject known invalid sequences (all same digit)
			if (/^(\d)\1{13}$/.test(digits)) {
				throw new Error(Cnpj.INVALID_CNPJ);
			}
			return Result.ok(new Cnpj(digits, config));
		} catch (error: any) {
			return Result.fail(error?.message ?? Cnpj.INVALID_CNPJ);
		}
	}

	get formatted(): string {
		const v = this.value;
		return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`;
	}

	public static format(value: string): string {
		const digits = String(value ?? "").replace(/\D/g, "");
		if (digits.length !== 14) return value;
		return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
	}
}
