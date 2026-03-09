import { Name } from "./name.vo";

export class SubCategoryName extends Name {
    protected static override readonly TOO_SHORT: string =
        "SUB_CATEGORY_NAME_TOO_SHORT";
    protected static override readonly TOO_LONG: string =
        "SUB_CATEGORY_NAME_TOO_LONG";
}
