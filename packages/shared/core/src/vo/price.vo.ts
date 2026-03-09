import { Result, ValueObject, ValueObjectConfig } from "../base";

export interface PriceConfig extends ValueObjectConfig {
    minValue?: number;
    maxValue?: number;
}

export class Price extends ValueObject<number, PriceConfig> {
    private static readonly TOO_SMALL = "PRICE_TOO_SMALL";
    private static readonly TOO_LARGE = "PRICE_TOO_LARGE";
    private constructor(value: number, config?: PriceConfig) {
        super(value, config);
    }

    public static create(value: number, config?: PriceConfig): Price {
        const result = Price.tryCreate(value, config);
        result.throwIfFailed();
        return result.instance;
    }

    public static tryCreate(
        value: number,
        config?: PriceConfig,
    ): Result<Price> {
        try {
            if (typeof value !== "number" || isNaN(value)) {
                throw new Error("Invalid price");
            }
            const min = config?.minValue ?? 0;
            const max = config?.maxValue ?? Number.MAX_SAFE_INTEGER;
            if (value < min) {
                throw new Error(Price.TOO_SMALL);
            }
            if (value > max) {
                throw new Error(Price.TOO_LARGE);
            }
            return Result.ok(new Price(value, config));
        } catch (error: any) {
            return Result.fail(error.message);
        }
    }

    get formattedValue(): string {
        return `R$ ${this.value.toFixed(2)}`;
    }
}
