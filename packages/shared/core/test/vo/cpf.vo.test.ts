import { Cpf } from "../../src";

describe("Cpf", () => {
	test("should create with valid cpf", () => {
		const result = Cpf.tryCreate("529.982.247-25");

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe("52998224725");
	});

	test("should normalize and store only digits", () => {
		const result = Cpf.tryCreate("  529.982.247-25  ");

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe("52998224725");
	});

	test("should expose formatted value", () => {
		const cpf = Cpf.create("52998224725");

		expect(cpf.formatted).toBe("529.982.247-25");
	});

	test("should expose base and check digits", () => {
		const cpf = Cpf.create("52998224725");

		expect(cpf.baseDigits).toBe("529982247");
		expect(cpf.checkDigits).toBe("25");
	});

	test("should compare cpf root", () => {
		const first = Cpf.create("52998224725");
		const second = Cpf.create("52998224725");
		const third = Cpf.create("16899535009");

		expect(first.hasSameRoot(second)).toBe(true);
		expect(first.hasSameRoot(third)).toBe(false);
	});

	test("should fail with cpf shorter than 11 digits", () => {
		const result = Cpf.tryCreate("1234567890");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_CPF");
	});

	test("should fail with repeated digits", () => {
		const result = Cpf.tryCreate("111.111.111-11");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_CPF");
	});

	test("should fail with invalid check digits", () => {
		const result = Cpf.tryCreate("529.982.247-26");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_CPF");
	});

	test("should fail when value is undefined", () => {
		const result = Cpf.tryCreate(undefined as unknown as string);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_CPF");
	});

	test("should throw when create receives invalid cpf", () => {
		expect(() => Cpf.create("123.456.789-10")).toThrow();
	});
});
