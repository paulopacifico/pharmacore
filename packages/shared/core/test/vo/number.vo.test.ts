import { Number as NumberVo } from "../../src";

describe("Number", () => {
	test("should create a valid number with tryCreate", () => {
		const result = NumberVo.tryCreate(10);

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe(10);
	});

	test("should create a valid number with create", () => {
		const value = NumberVo.create(25, { minValue: 1, maxValue: 100 });

		expect(value.value).toBe(25);
	});

	test("should fail when value is NaN", () => {
		const result = NumberVo.tryCreate(Number.NaN);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_NUMBER");
	});

	test("should fail when value is not a number", () => {
		const result = NumberVo.tryCreate("10" as unknown as number);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_NUMBER");
	});

	test("should fail when value is smaller than minValue", () => {
		const result = NumberVo.tryCreate(4, { minValue: 5 });

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("NUMBER_TOO_SMALL");
	});

	test("should fail when value is greater than maxValue", () => {
		const result = NumberVo.tryCreate(11, { maxValue: 10 });

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("NUMBER_TOO_LARGE");
	});

	test("should throw when create receives invalid value", () => {
		expect(() => NumberVo.create(Number.NaN)).toThrow();
	});
});
