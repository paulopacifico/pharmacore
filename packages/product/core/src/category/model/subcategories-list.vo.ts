import { Result, ValueObject, ValueObjectConfig } from "@pharmacore/shared";
import { Subcategory, SubcategoryProps } from "./subcategory.entity";

interface SubcategoriesListProps {
    items: SubcategoryProps[];
}

export class SubcategoriesList extends ValueObject<
    SubcategoriesListProps,
    ValueObjectConfig
> {
    readonly _items: Subcategory[];

    private constructor(
        props: SubcategoriesListProps,
        config?: ValueObjectConfig,
    ) {
        super(props, config);
        this._items = props.items.map((p, index) =>
            Subcategory.create({ ...p, order: p.order ?? index }),
        );
    }

    get items(): Subcategory[] {
        return this._items.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    static create(props: SubcategoryProps[]): SubcategoriesList {
        const result = SubcategoriesList.tryCreate(props);
        result.throwIfFailed();
        return result.instance;
    }

    static tryCreate(props: SubcategoryProps[]): Result<SubcategoriesList> {
        const results = props.map((p, index) =>
            Subcategory.tryCreate({ ...p, order: p.order ?? index }),
        );

        const combinedResult = Result.combine(results);
        if (combinedResult.isFailure) {
            return combinedResult.withFail;
        }

        return Result.ok(new SubcategoriesList({ items: props }));
    }

    move(subcategory: Subcategory, delta: number): SubcategoriesList {
        const subcategoryId = subcategory.id;

        const origin = this.items.findIndex((s) => s.id === subcategoryId);
        if (origin === -1) return this;

        const destination = origin + delta;
        if (destination < 0 || destination >= this.items.length) return this;

        const subcategoriesProps = this.items.map((s) => s.props);
        const [subcategoryToMove] = subcategoriesProps.splice(origin, 1) as [
            SubcategoryProps,
        ];
        subcategoriesProps.splice(destination, 0, subcategoryToMove);

        return SubcategoriesList.create(
            subcategoriesProps.map((p, i) => ({ ...p, order: i })),
        );
    }

    moveUp(subcategory: Subcategory): SubcategoriesList {
        return this.move(subcategory, -1);
    }

    moveDown(subcategory: Subcategory): SubcategoriesList {
        return this.move(subcategory, 1);
    }
}
