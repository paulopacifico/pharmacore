import { Category, Subcategory } from "../../src";
import { SubcategoriesList } from "../../src/category/model/subcategories-list.vo";

describe("Category Entity", () => {
    const validCategoryProps = {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Eletrônicos",
        // subcategories: [],
    };

    // test("should create a category without subcategory ", () => {
    // 	const result = Category.tryCreate(validCategoryProps);
    // 	expect(result.isOk).toBe(true);
    // 	const category = result.instance;

    // 	expect(category).toBeInstanceOf(Category);
    // 	expect(category.id).toBe(validCategoryProps.id);
    // 	expect(category.name).toBe(validCategoryProps.name);
    // });

    // test("should create a category with subcategories", () => {
    // 	const subcategory1 = Subcategory.create({
    // 		id: "550e8400-e29b-41d4-a716-446655440101",
    // 		name: "Smartphones",
    // 		parentId: validCategoryProps.id,
    // 	});

    // 	const subcategory2 = Subcategory.create({
    // 		id: "550e8400-e29b-41d4-a716-446655440102",
    // 		name: "Tablets",
    // 		parentId: validCategoryProps.id,
    // 	});

    // 	const categoryPropsWithSubcategories = {
    // 		...validCategoryProps,
    // 		subcategories: [subcategory1, subcategory2],
    // 	};

    // 	const result = Category.tryCreate(categoryPropsWithSubcategories);

    // 	expect(result.isFailure).toBe(false);
    // });

    test("should move subcategories", () => {
        const subcategory1 = Subcategory.create({
            id: "550e8400-e29b-41d4-a716-446655440101",
            name: "1Smartphones",
            parentId: validCategoryProps.id,
            alias: "smartphones",
            order: 1,
        });

        const subcategory2 = Subcategory.create({
            id: "550e8400-e29b-41d4-a716-446655440102",
            name: "2Tablets",
            parentId: validCategoryProps.id,
            alias: "tablets",
            order: 2,
        });

        const subcategory3 = Subcategory.create({
            id: "550e8400-e29b-41d4-a716-446655440103",
            name: "3Acessórios",
            parentId: validCategoryProps.id,
            alias: "accessories",
            order: 3,
        });

        const subcategoryList = SubcategoriesList.create([
            subcategory1.props,
            subcategory2.props,
            subcategory3.props,
        ]);

        const categoryPropsWithSubcategories = {
            ...validCategoryProps,
            subcategories: subcategoryList,
            alias: "electronics",
        };

        const cat = Category.create(categoryPropsWithSubcategories);

        const result = cat
            .moveSubcategoryDown(subcategory1)
            .moveSubcategoryDown(subcategory1);

        const result2 = result.moveSubcategoryUp(subcategory1);
        // .moveSubcategoryDown(subcategory2);

        const result3 = result2.moveSubcategory(subcategory3, -2);

        console.log(
            result2.subcategories.map((s) => ({
                name: s.name,
                order: s.order,
            })),
        );
    });
});
