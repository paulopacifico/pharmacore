import { CategoryProps } from "../model";

export interface CategoryDetailsDTO extends Omit<
    CategoryProps,
    "subcategories"
> {
    subcategories?: { id: string; name: string; alias: string }[];
}
