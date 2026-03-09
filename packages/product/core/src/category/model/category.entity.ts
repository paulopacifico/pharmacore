import { Alias, Entity, EntityProps, Id, Result } from "@pharmacore/shared";
import { Subcategory } from "./subcategory.entity";
import { SubcategoriesList } from "./subcategories-list.vo";
import { CategoryName } from "./category-name.vo";

export interface CategoryProps extends EntityProps {
    name: string;
    subcategories: SubcategoriesList;
    alias: string;
}

export class Category extends Entity<Category, CategoryProps> {
    protected constructor(props: CategoryProps) {
        super(props);
    }

    get name(): string {
        return this.props.name;
    }

    get subcategories(): Subcategory[] {
        return this.props.subcategories.items;
    }

    get alias(): string {
        return this.props.alias;
    }

    static create(props: CategoryProps): Category {
        const result = Category.tryCreate(props);
        result.throwIfFailed();
        return result.instance;
    }

    static tryCreate(props: CategoryProps): Result<Category> {
        const id = Id.tryCreate(props.id);
        const name = CategoryName.tryCreate(props.name);
        const alias = Alias.tryCreate(props.alias);

        const attributes = Result.combine([id, name, alias]);

        if (attributes.isFailure) {
            return attributes.withFail;
        }

        return Result.ok(
            new Category({
                ...props,
                id: id.instance.value,
                name: name.instance.value,
                alias: alias.instance.value,
            }),
        );
    }

    moveSubcategory(subcategory: Subcategory, delta: number): Category {
        const subcategoriesList = this.props.subcategories.move(
            subcategory,
            delta,
        );
        return Category.create({
            ...this.props,
            subcategories: subcategoriesList,
        });
    }

    moveSubcategoryUp(subcategory: Subcategory): Category {
        return this.moveSubcategory(subcategory, -1);
    }

    moveSubcategoryDown(subcategory: Subcategory): Category {
        return this.moveSubcategory(subcategory, 1);
    }
}
