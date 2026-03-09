import { Result, ValueObject, ValueObjectConfig } from "../base";

export class DateVO extends ValueObject<Date, ValueObjectConfig> {
	private static readonly INVALID_DATE = "INVALID_DATE";

	private constructor(value: Date, config?: ValueObjectConfig) {
		super(value, config);
	}

	public static create(value: unknown, config?: ValueObjectConfig): DateVO {
		const result = DateVO.tryCreate(value, config);
		result.throwIfFailed();
		return result.instance;
	}

	public static tryCreate(
		value: unknown,
		config?: ValueObjectConfig,
	): Result<DateVO> {
		try {
			if (value == null) {
				throw new Error(DateVO.INVALID_DATE);
			}
			const date =
				value instanceof Date ? value : new Date(String(value));
			if (isNaN(date.getTime())) {
				throw new Error(DateVO.INVALID_DATE);
			}
			return Result.ok(new DateVO(date, config));
		} catch (error: any) {
			return Result.fail(error?.message ?? DateVO.INVALID_DATE);
		}
	}

	public static fromUnknown(value: unknown): Date | null {
		if (value == null) return null;
		if (value instanceof Date) return value;
		if (typeof value === "string" || typeof value === "number") {
			const date = new Date(value);
			return isNaN(date.getTime()) ? null : date;
		}
		return null;
	}

	public static format(date: Date | string | null | undefined): string {
		if (date == null) return "—";
		const d = typeof date === "string" ? new Date(date) : date;
		if (isNaN(d.getTime())) return "—";
		const day = String(d.getUTCDate()).padStart(2, "0");
		const month = String(d.getUTCMonth() + 1).padStart(2, "0");
		const year = d.getUTCFullYear();
		return `${day}/${month}/${year}`;
	}

	public static toInputValue(
		value: Date | string | null | undefined,
	): string {
		if (value == null) return "";
		const date = typeof value === "string" ? new Date(value) : value;
		if (isNaN(date.getTime())) return "";
		return date.toISOString().slice(0, 10);
	}

	get formatted(): string {
		const d = this.value;
		const day = String(d.getUTCDate()).padStart(2, "0");
		const month = String(d.getUTCMonth() + 1).padStart(2, "0");
		const year = d.getUTCFullYear();
		return `${day}/${month}/${year}`;
	}

	get inputValue(): string {
		return this.value.toISOString().slice(0, 10);
	}
}
