import { Result, ValueObject, ValueObjectConfig } from "../base";

export class Alias extends ValueObject<string, ValueObjectConfig> {
	private static readonly INVALID_ALIAS = "INVALID_ALIAS";

	private constructor(value: string, config?: ValueObjectConfig) {
		super(value, config);
	}

	public static create(value: string, config?: ValueObjectConfig): Alias {
		const result = Alias.tryCreate(value, config);
		result.throwIfFailed();
		return result.instance;
	}

	public static fromText(text: string, config?: ValueObjectConfig): Alias {
		if (typeof text !== "string") {
			throw new Error(Alias.INVALID_ALIAS);
		}

		const normalized = text
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "");

		return Alias.create(normalized, config);
	}

	public static tryCreate(
		value: string,
		config?: ValueObjectConfig,
	): Result<Alias> {
		try {
			if (typeof value !== "string") {
				throw new Error(Alias.INVALID_ALIAS);
			}

			const normalized = value.trim().toLowerCase().replace(/\s+/g, "-");

			if (!normalized) {
				throw new Error(Alias.INVALID_ALIAS);
			}

			if (!/^[a-z0-9-]+$/.test(normalized)) {
				throw new Error(Alias.INVALID_ALIAS);
			}

			return Result.ok(new Alias(normalized, config));
		} catch (error: any) {
			return Result.fail(error.message);
		}
	}
}
