export interface CategorySubcategoryRelationDTO {
    name: string;
    productsCount: number;
    subcategories: {
        name: string;
        productsCount: number;
    };
}
