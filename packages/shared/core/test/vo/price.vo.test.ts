import { Price } from "../../src";

describe("Price", () => {
	test("should create a valid price with tryCreate", () => {
		const result = Price.tryCreate(10.5);

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe(10.5);
	});

	test("should create a valid price with create", () => {
		const price = Price.create(99.9, { minValue: 1, maxValue: 1000 });

		expect(price.value).toBe(99.9);
	});

	test("should format value as currency string", () => {
		const price = Price.create(12);

		expect(price.formattedValue).toBe("R$ 12.00");
	});

	test("should fail when value is not a number", () => {
		const result = Price.tryCreate("12" as unknown as number);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("Invalid price");
	});

	test("should fail when value is NaN", () => {
		const result = Price.tryCreate(Number.NaN);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("Invalid price");
	});

	test("should fail when value is below configured min", () => {
		const result = Price.tryCreate(4, { minValue: 5 });

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("PRICE_TOO_SMALL");
	});

	test("should fail when value is above configured max", () => {
		const result = Price.tryCreate(101, { maxValue: 100 });

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("PRICE_TOO_LARGE");
	});

	test("should fail when value is below default min (0)", () => {
		const result = Price.tryCreate(-1);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("PRICE_TOO_SMALL");
	});

	test("should throw when create receives invalid value", () => {
		expect(() => Price.create(Number.NaN)).toThrow();
	});
});
