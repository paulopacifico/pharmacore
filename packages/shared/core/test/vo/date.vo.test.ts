import { DateVO } from "../../src";

describe("DateVO", () => {
	const validDateStr = "2024-06-15T12:00:00.000Z";
	const validDate = new Date(validDateStr);

	describe("tryCreate", () => {
		test("should create with valid date string", () => {
			const result = DateVO.tryCreate(validDateStr);
			expect(result.isOk).toBe(true);
			expect(result.instance.value).toEqual(validDate);
		});

		test("should create with valid Date instance", () => {
			const result = DateVO.tryCreate(validDate);
			expect(result.isOk).toBe(true);
			expect(result.instance.value).toEqual(validDate);
		});

		test("should fail with null", () => {
			const result = DateVO.tryCreate(null);
			expect(result.isFailure).toBe(true);
		});

		test("should fail with undefined", () => {
			const result = DateVO.tryCreate(undefined);
			expect(result.isFailure).toBe(true);
		});

		test("should fail with invalid date string", () => {
			const result = DateVO.tryCreate("not-a-date");
			expect(result.isFailure).toBe(true);
		});
	});

	describe("create", () => {
		test("should create with valid date", () => {
			const vo = DateVO.create(validDateStr);
			expect(vo.value).toEqual(validDate);
		});

		test("should throw with invalid date", () => {
			expect(() => DateVO.create("invalid")).toThrow();
		});
	});

	describe("fromUnknown", () => {
		test("should return Date for valid date string", () => {
			const result = DateVO.fromUnknown(validDateStr);
			expect(result).toEqual(validDate);
		});

		test("should return Date for Date instance", () => {
			const result = DateVO.fromUnknown(validDate);
			expect(result).toBe(validDate);
		});

		test("should return Date for valid timestamp number", () => {
			const ts = validDate.getTime();
			const result = DateVO.fromUnknown(ts);
			expect(result).toEqual(validDate);
		});

		test("should return null for null", () => {
			expect(DateVO.fromUnknown(null)).toBeNull();
		});

		test("should return null for undefined", () => {
			expect(DateVO.fromUnknown(undefined)).toBeNull();
		});

		test("should return null for invalid string", () => {
			expect(DateVO.fromUnknown("invalid")).toBeNull();
		});

		test("should return null for non-date types", () => {
			expect(DateVO.fromUnknown({})).toBeNull();
			expect(DateVO.fromUnknown([])).toBeNull();
			expect(DateVO.fromUnknown(true)).toBeNull();
		});
	});

	describe("format", () => {
		test("should format Date to dd/mm/yyyy", () => {
			expect(DateVO.format(new Date("2024-06-15T00:00:00.000Z"))).toBe(
				"15/06/2024",
			);
		});

		test("should format date string to dd/mm/yyyy", () => {
			expect(DateVO.format("2024-01-05T00:00:00.000Z")).toBe(
				"05/01/2024",
			);
		});

		test("should return dash for null", () => {
			expect(DateVO.format(null)).toBe("—");
		});

		test("should return dash for undefined", () => {
			expect(DateVO.format(undefined)).toBe("—");
		});

		test("should return dash for invalid date string", () => {
			expect(DateVO.format("invalid")).toBe("—");
		});
	});

	describe("toInputValue", () => {
		test("should return yyyy-mm-dd for valid Date", () => {
			expect(
				DateVO.toInputValue(new Date("2024-06-15T00:00:00.000Z")),
			).toBe("2024-06-15");
		});

		test("should return yyyy-mm-dd for valid string", () => {
			expect(DateVO.toInputValue("2024-06-15T00:00:00.000Z")).toBe(
				"2024-06-15",
			);
		});

		test("should return empty string for null", () => {
			expect(DateVO.toInputValue(null)).toBe("");
		});

		test("should return empty string for undefined", () => {
			expect(DateVO.toInputValue(undefined)).toBe("");
		});

		test("should return empty string for invalid string", () => {
			expect(DateVO.toInputValue("invalid")).toBe("");
		});
	});

	describe("instance getters", () => {
		test("formatted should return dd/mm/yyyy", () => {
			const vo = DateVO.create("2024-06-15T00:00:00.000Z");
			expect(vo.formatted).toBe("15/06/2024");
		});

		test("inputValue should return yyyy-mm-dd", () => {
			const vo = DateVO.create("2024-06-15T00:00:00.000Z");
			expect(vo.inputValue).toBe("2024-06-15");
		});
	});
});
