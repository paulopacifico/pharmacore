import { Result, ValueObject, ValueObjectConfig } from "../base";

export interface NumberConfig extends ValueObjectConfig {
	minValue?: number;
	maxValue?: number;
}

export class Number extends ValueObject<number, NumberConfig> {
	private static readonly TOO_SMALL = "NUMBER_TOO_SMALL";
	private static readonly TOO_LARGE = "NUMBER_TOO_LARGE";
	private static readonly INVALID_NUMBER = "INVALID_NUMBER";

	private constructor(value: number, config?: NumberConfig) {
		super(value, config);
	}

	public static create(value: number, config?: NumberConfig): Number {
		const result = Number.tryCreate(value, config);
		result.throwIfFailed();
		return result.instance;
	}

	public static tryCreate(
		value: number,
		config?: NumberConfig,
	): Result<Number> {
		try {
			if (typeof value !== "number" || isNaN(value)) {
				throw new Error(Number.INVALID_NUMBER);
			}
			const min = config?.minValue;
			const max = config?.maxValue;
			if (min && value < min) {
				throw new Error(Number.TOO_SMALL);
			}
			if (max && value > max) {
				throw new Error(Number.TOO_LARGE);
			}
			return Result.ok(new Number(value, config));
		} catch (error: any) {
			return Result.fail(error.message);
		}
	}
}
