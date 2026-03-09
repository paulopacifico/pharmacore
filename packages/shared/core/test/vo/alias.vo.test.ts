import { Alias } from "../../src";

describe("Alias", () => {
	test("should create a valid alias", () => {
		const result = Alias.tryCreate("produto-123");

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe("produto-123");
	});

	test("should normalize alias with spaces and uppercase letters", () => {
		const result = Alias.tryCreate("  Meu Produto 01  ");

		expect(result.isOk).toBe(true);
		expect(result.instance.value).toBe("meu-produto-01");
	});

	test("should create alias using create method", () => {
		const alias = Alias.create("Meu Produto");

		expect(alias.value).toBe("meu-produto");
	});

	test("should create alias from text removing accents and normalizing whitespace", () => {
		const alias = Alias.fromText("  Coração\tde Açúcar 123  ");

		expect(alias.value).toBe("coracao-de-acucar-123");
	});

	test("should create alias from text replacing cedilha and preserving numbers", () => {
		const alias = Alias.fromText("Seção 99");

		expect(alias.value).toBe("secao-99");
	});

	test("should create alias from text removing invalid characters", () => {
		const alias = Alias.fromText("Produto #1 @ teste!");

		expect(alias.value).toBe("produto-1-teste");
	});

	test("should fail when value is not a string", () => {
		const result = Alias.tryCreate(null as unknown as string);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_ALIAS");
	});

	test("should fail when alias is empty after trim", () => {
		const result = Alias.tryCreate("   ");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_ALIAS");
	});

	test("should fail when alias has invalid characters", () => {
		const result = Alias.tryCreate("produto_teste");

		expect(result.isFailure).toBe(true);
		expect(result.errors).toContain("INVALID_ALIAS");
	});

	test("should throw when create receives invalid alias", () => {
		expect(() => Alias.create("produto@teste")).toThrow();
	});

	test("should throw when fromText receives invalid value", () => {
		expect(() => Alias.fromText(null as unknown as string)).toThrow();
	});
});
