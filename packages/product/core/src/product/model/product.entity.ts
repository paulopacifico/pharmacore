import {
    Entity,
    EntityProps,
    Id,
    Price,
    Result,
    URL,
    Text,
    Sku,
    Alias,
} from "@pharmacore/shared";
import { ProductName } from "./product.name.vo";
import {
    ProductCharacteristic,
    ProductCharacteristicProps,
} from "./product-characteristic.vo";

export interface ProductProps extends EntityProps {
    name: string;
    alias: string;
    description: string;
    imagesURL: string[];
    price: number;
    sku: string;
    subcategoryId: string;
    brandId: string;
    characteristics: ProductCharacteristicProps[];
}

export class Product extends Entity<Product, ProductProps> {
    private constructor(props: ProductProps) {
        super(props);
    }

    get name(): string {
        return this.props.name;
    }
    get alias(): string {
        return this.props.alias;
    }
    get description(): string {
        return this.props.description;
    }
    get imagesURL(): string[] {
        return this.props.imagesURL;
    }
    get price(): number {
        return this.props.price;
    }
    get sku(): string {
        return this.props.sku;
    }
    get brandId(): string {
        return this.props.brandId;
    }
    get subcategoryId(): string {
        return this.props.subcategoryId;
    }
    get characteristics(): ProductCharacteristicProps[] {
        return this.props.characteristics ?? [];
    }

    public static create(props: ProductProps): Product {
        const result = Product.tryCreate(props);
        result.throwIfFailed();
        return result.instance;
    }

    static tryCreate(props: ProductProps): Result<Product> {
        const id = Id.tryCreate(props.id);
        const urls =
            props.imagesURL && props.imagesURL.length > 0
                ? props.imagesURL.map((url) => URL.tryCreate(url))
                : [];
        const name = ProductName.tryCreate(props.name);
        const alias = Alias.tryCreate(props.alias);
        const description = Text.tryCreate(props.description, {
            minLength: 10,
        });
        const price = Price.tryCreate(props.price, {
            minValue: 0,
        });

        const sku = Sku.tryCreate(props.sku);

        const subcategoryId = Id.tryCreate(props.subcategoryId);

        const characteristics = (props.characteristics || []).map((char) =>
            ProductCharacteristic.tryCreate(char),
        );

        const attributes = Result.combine<any>([
            id,
            name,
            alias,
            description,
            price,
            subcategoryId,
            sku,
            ...urls,
            ...characteristics,
        ]);
        if (attributes.isFailure) {
            return Result.fail(attributes.errors!);
        }

        return Result.ok(
            new Product({
                ...props,
                id: id.instance.value,
                name: name.instance.value,
                alias: alias.instance.value,
                imagesURL: urls.map((u) => u.instance.value),
                description: description.instance.value,
                price: price.instance.value,
                sku: sku.instance.value,
                subcategoryId: subcategoryId.instance.value,
                brandId: props.brandId,
                characteristics: characteristics.map((c) => c.instance.value),
            }),
        );
    }
}
