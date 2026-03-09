import { Name } from "@pharmacore/shared";

export class ProductName extends Name {
    protected static override readonly TOO_SHORT: string =
        "PRODUCT_NAME_TOO_SHORT";
    protected static override readonly TOO_LONG: string =
        "PRODUCT_NAME_TOO_LONG";
}
