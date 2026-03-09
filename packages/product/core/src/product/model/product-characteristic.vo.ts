import {
    Result,
    Text,
    ValueObject,
    ValueObjectConfig,
} from "@pharmacore/shared";

export interface ProductCharacteristicProps {
    name: string;
    value: string;
}

export class ProductCharacteristic extends ValueObject<
    ProductCharacteristicProps,
    ValueObjectConfig
> {
    private constructor(
        value: ProductCharacteristicProps,
        config?: ValueObjectConfig,
    ) {
        super(value, config);
    }

    get characteristicName(): string {
        return this.value.name;
    }

    get characteristicValue(): string {
        return this.value.value;
    }

    static tryCreate(
        props: ProductCharacteristicProps,
        config?: ValueObjectConfig,
    ): Result<ProductCharacteristic> {
        const name = Text.tryCreate(props.name, { minLength: 3 });
        const value = Text.tryCreate(props.value, { minLength: 3 });

        const combinedResult = Result.combine([name, value]);

        if (combinedResult.isFailure) {
            return Result.fail(combinedResult.errors!);
        }

        return Result.ok(
            new ProductCharacteristic(
                {
                    name: name.instance.value,
                    value: value.instance.value,
                },
                config,
            ),
        );
    }
}
