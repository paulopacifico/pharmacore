import { Sku } from "../../src";

describe("Sku", () => {
	test("should create a valid sku with tryCreate", () => {
		const result = Sku.tryCreate("abc-123");

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe("ABC-123");
	});

	test("should trim and uppercase sku", () => {
		const result = Sku.tryCreate("  prd-001  ");

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe("PRD-001");
	});

	test("should create a valid sku with create", () => {
		const sku = Sku.create("item-9");

		expect(sku.value).toBe("ITEM-9");
	});

	test("should fail when sku is too short", () => {
		const result = Sku.tryCreate("ab");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_SKU");
	});

	test("should fail when sku is too long", () => {
		const result = Sku.tryCreate("a".repeat(51));

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_SKU");
	});

	test("should fail when sku has invalid characters", () => {
		const result = Sku.tryCreate("sku_123");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_SKU");
	});

	test("should fail when value is not a string", () => {
		const result = Sku.tryCreate(null as unknown as string);

		expect(result.isFailure).toBe(true);
	});

	test("should throw when create receives invalid sku", () => {
		expect(() => Sku.create("x")).toThrow();
	});
});
