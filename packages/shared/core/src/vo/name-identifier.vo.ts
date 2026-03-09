import { Result, ValueObject, ValueObjectConfig } from "../base";

interface NameIdentifierConfig extends ValueObjectConfig {
	minLength?: number;
	maxLength?: number;
}

export class NameIdentifier extends ValueObject<string, NameIdentifierConfig> {
	private static readonly TOO_SHORT = "NAME_IDENTIFIER_TOO_SHORT";
	private static readonly TOO_LONG = "NAME_IDENTIFIER_TOO_LONG";
	private constructor(value: string, config?: NameIdentifierConfig) {
		super(value, config);
	}

	public static create(
		value: string,
		config?: NameIdentifierConfig,
	): NameIdentifier {
		const result = NameIdentifier.tryCreate(value, config);
		result.throwIfFailed();
		return result.instance;
	}

	public static tryCreate(
		value: string,
		config?: NameIdentifierConfig,
	): Result<NameIdentifier> {
		try {
			const trimmedValue = value.trim();
			const min = 3;
			const max = 50;

			if (trimmedValue.length < min) {
				throw new Error(NameIdentifier.TOO_SHORT);
			}
			if (trimmedValue.length > max) {
				throw new Error(NameIdentifier.TOO_LONG);
			}

			const normalizedValue = NameIdentifier.normalize(trimmedValue);
			return Result.ok(new NameIdentifier(normalizedValue, config));
		} catch (error: any) {
			return Result.fail(error.message);
		}
	}

	private static normalize(value: string): string {
		return value.trim().toLowerCase().replace(/\s+/g, "-");
	}

	equals(other: NameIdentifier): boolean {
		return this.value === NameIdentifier.normalize(other.value);
	}
}
