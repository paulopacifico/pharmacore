import { Result, ValueObject, ValueObjectConfig } from "../base";

export class Sku extends ValueObject<string, ValueObjectConfig> {
	private static readonly INVALID_SKU = "INVALID_SKU";
	private constructor(value: string, config?: ValueObjectConfig) {
		super(value, config);
	}

	public static create(value: string, config?: ValueObjectConfig): Sku {
		const result = Sku.tryCreate(value, config);
		result.throwIfFailed();
		return result.instance;
	}

	public static tryCreate(
		value: string,
		config?: ValueObjectConfig,
	): Result<Sku> {
		try {
			const sku = value.trim();
			if (sku.length < 3) {
				throw new Error(Sku.INVALID_SKU);
			}
			if (sku.length > 50) {
				throw new Error(Sku.INVALID_SKU);
			}
			if (!/^[A-Za-z0-9-]+$/.test(sku)) {
				throw new Error(Sku.INVALID_SKU);
			}
			const standardizedValue = sku.toUpperCase();
			return Result.ok(new Sku(standardizedValue, config));
		} catch (error: any) {
			return Result.fail(error.message);
		}
	}
}
