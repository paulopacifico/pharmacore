import { SubcategoryProps } from "../model";

export interface SubcategoryListDTO extends Array<
    Pick<SubcategoryProps, "id" | "name" | "alias">
> {}
