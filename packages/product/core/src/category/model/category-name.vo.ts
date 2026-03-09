import { Name } from "@pharmacore/shared";

export class CategoryName extends Name {
    protected static override readonly TOO_SHORT: string =
        "CATEGORY_NAME_TOO_SHORT";
    protected static override readonly TOO_LONG: string =
        "CATEGORY_NAME_TOO_LONG";
}
