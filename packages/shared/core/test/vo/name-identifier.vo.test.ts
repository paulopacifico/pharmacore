import { NameIdentifier } from "../../src";

describe("NameIdentifier", () => {
	test("should create and normalize a valid identifier", () => {
		const result = NameIdentifier.tryCreate("  Meu   Produto  ");

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe("meu-produto");
	});

	test("should fail when value is too short", () => {
		const result = NameIdentifier.tryCreate("ab");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("NAME_IDENTIFIER_TOO_SHORT");
	});

	test("should fail when value is too long", () => {
		const longValue = "a".repeat(51);
		const result = NameIdentifier.tryCreate(longValue);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("NAME_IDENTIFIER_TOO_LONG");
	});

	test("should throw when create receives invalid value", () => {
		expect(() => NameIdentifier.create("ab")).toThrow();
	});

	test("should compare equal identifiers even when other value is not normalized", () => {
		const identifier = NameIdentifier.create("Meu Produto");
		const other = Object.create(NameIdentifier.prototype) as NameIdentifier & {
			value: string;
		};
		other.value = "  meu   produto  ";

		expect(identifier.equals(other)).toBe(true);
	});

	test("should compare different identifiers as not equal", () => {
		const left = NameIdentifier.create("Meu Produto");
		const right = NameIdentifier.create("Outro Produto");

		expect(left.equals(right)).toBe(false);
	});
});
