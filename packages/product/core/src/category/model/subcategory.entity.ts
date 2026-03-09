import {
    Alias,
    Entity,
    EntityProps,
    Id,
    Name,
    Number,
    Result,
} from "@pharmacore/shared";

export interface SubcategoryProps extends EntityProps {
    name: string;
    parentId: string;
    alias: string;
    order: number;
}

export class Subcategory extends Entity<Subcategory, SubcategoryProps> {
    declare readonly props: SubcategoryProps;

    private constructor(props: SubcategoryProps) {
        super(props);
    }

    get parentId(): string | null | undefined {
        return this.props.parentId;
    }

    get name(): string {
        return this.props.name;
    }

    get order(): number {
        return this.props.order;
    }

    get alias(): string {
        return this.props.alias;
    }

    belongsTo(parentId: string): boolean {
        return this.parentId === parentId;
    }

    static create(props: SubcategoryProps): Subcategory {
        const result = Subcategory.tryCreate(props);
        result.throwIfFailed();
        return result.instance;
    }

    static tryCreate(props: SubcategoryProps): Result<Subcategory> {
        const id = Id.tryCreate(props.id);
        const name = Name.tryCreate(props.name);
        const alias = Alias.tryCreate(props.alias);
        const parentId = Id.tryCreate(props.parentId);
        const order = Number.tryCreate(props.order || 0);

        const attributes = Result.combine<any>([
            id,
            name,
            alias,
            parentId,
            order,
        ]);
        if (attributes.isFailure) {
            return attributes.withFail;
        }

        return Result.ok(
            new Subcategory({
                ...props,
                id: id.instance.value,
                name: name.instance.value,
                alias: alias.instance.value,
                parentId: parentId.instance.value,
                order: order.instance.value,
            }),
        );
    }
}
