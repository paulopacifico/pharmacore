import {
    Alias,
    Entity,
    EntityProps,
    Id,
    Name,
    Result,
} from "@pharmacore/shared";

export interface BrandProps extends EntityProps {
    name: string;
    alias: string;
}

export class Brand extends Entity<Brand, BrandProps> {
    declare readonly props: BrandProps;

    private constructor(props: BrandProps) {
        super(props);
    }

    get name(): string {
        return this.props.name;
    }

    get alias(): string {
        return this.props.alias;
    }

    static create(props: BrandProps): Brand {
        const result = Brand.tryCreate(props);
        result.throwIfFailed();
        return result.instance;
    }

    static tryCreate(props: BrandProps): Result<Brand> {
        const id = Id.tryCreate(props.id);
        const name = Name.tryCreate(props.name);
        const alias = Alias.tryCreate(props.alias);

        const attributes = Result.combine<any>([id, name, alias]);
        if (attributes.isFailure) {
            return attributes.withFail;
        }

        return Result.ok(
            new Brand({
                ...props,
                id: id.instance.value,
                name: name.instance.value,
                alias: alias.instance.value,
            }),
        );
    }
}
