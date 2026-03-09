import { Product } from "../../src";

describe("Product Entity", () => {
    const validProductProps = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Valid Product",
        alias: "valid-product",
        description: "This is a valid product description.",
        price: 29.99,
        imagesURL: ["http://example.com/image1.png"],
        sku: "PROD-001",
        subcategoryId: "660e8400-e29b-41d4-a716-446655440000",
        brandId: "770e8400-e29b-41d4-a716-446655440000",
        characteristics: [],
    };

    test("should create a product with valid properties", () => {
        const result = Product.tryCreate(validProductProps);

        expect(result.isOk).toBe(true);
        const product = result.instance;

        expect(product).toBeInstanceOf(Product);
        expect(product.id).toBe(validProductProps.id);
        expect(product.name).toBe(validProductProps.name);
        expect(product.description).toBe(validProductProps.description);
        expect(product.price).toBe(validProductProps.price);
        expect(product.imagesURL).toEqual(validProductProps.imagesURL);
    });

    test("should show validation errors for invalid properties", () => {
        const productProps = {
            id: "invalid-id",
            name: "",
            alias: "",
            description: "Short",
            price: -10,
            imagesURL: ["not-a-url"],
            sku: "",
            subcategoryId: "invalid-id",
            brandId: "invalid-id",
            characteristics: [],
        };

        const result = Product.tryCreate(productProps);

        expect(result.isFailure).toBe(true);
        expect(result?.errors?.length).toBeGreaterThan(0);
        expect(result.errors).toEqual(
            expect.arrayContaining([
                "INVALID_ID",
                "PRODUCT_NAME_TOO_SHORT",
                "INVALID_ALIAS",
                "TEXT_TOO_SHORT",
                "PRICE_TOO_SMALL",
                "INVALID_SKU",
                "INVALID_URL",
            ]),
        );
    });

    test("should create a product with an empty imagesURL array", () => {
        const props = { ...validProductProps, imagesURL: [] };
        const result = Product.tryCreate(props);

        expect(result.isOk).toBe(true);
        const product = result.instance;
        expect(product.imagesURL).toEqual([]);
    });

    test("should fail with invalid URL in imagesURL", () => {
        const props = { ...validProductProps, imagesURL: ["invalid-url"] };
        const result = Product.tryCreate(props);

        expect(result.isFailure).toBe(true);
        expect(result.errors).toEqual(expect.arrayContaining(["INVALID_URL"]));
    });

    test("getters should return correct values", () => {
        const product = Product.create(validProductProps);

        expect(product.name).toBe(validProductProps.name);
        expect(product.description).toBe(validProductProps.description);
        expect(product.price).toBe(validProductProps.price);
        expect(product.imagesURL).toEqual(validProductProps.imagesURL);
    });
});
