import { Address } from "../../src";

describe("Address", () => {
	const valid = {
		street: "Av. Paulista",
		number: "1000",
		complement: "Conjunto 12",
		neighborhood: "Bela Vista",
		city: "São Paulo",
		state: "SP",
		zip: "01310-100",
		country: "Brasil",
	};

	test("should create with valid address", () => {
		const result = Address.tryCreate(valid, { attribute: "address" });

		expect(result.isOk).toBe(true);
	});

	test("should create with create method and expose all getters", () => {
		const address = Address.create(valid, { attribute: "address" });

		expect(address.street).toBe(valid.street);
		expect(address.number).toBe(valid.number);
		expect(address.complement).toBe(valid.complement);
		expect(address.neighborhood).toBe(valid.neighborhood);
		expect(address.city).toBe(valid.city);
		expect(address.state).toBe(valid.state);
		expect(address.zip).toBe(valid.zip);
		expect(address.country).toBe(valid.country);
	});

	test("should fallback optional fields to empty string", () => {
		const result = Address.tryCreate({
			street: "Rua A",
			number: undefined as unknown as string,
			complement: undefined as unknown as string,
			neighborhood: undefined as unknown as string,
			city: "Campinas",
			state: "SP",
			zip: "13000-000",
			country: "Brasil",
		});

		expect(result.isOk).toBe(true);
		expect(result.instance.number).toBe("");
		expect(result.instance.complement).toBe("");
		expect(result.instance.neighborhood).toBe("");
	});

	test("should fail with invalid address", () => {
		const invalid = {
			street: "",
			number: "",
			complement: "",
			neighborhood: "",
			city: "",
			state: "",
			zip: "",
			country: "",
		};
		const result = Address.tryCreate(invalid, { attribute: "address" });

		expect(result.isFailure).toBe(true);
	});

	describe("shortLabel", () => {
		test("should return city - state", () => {
			const address = Address.create(valid);
			expect(address.shortLabel).toBe("São Paulo - SP");
		});
	});

	describe("formatShort", () => {
		test("should return city - state from plain object", () => {
			expect(
				Address.formatShort({ city: "Campinas", state: "SP" }),
			).toBe("Campinas - SP");
		});

		test("should return dash when both are empty", () => {
			expect(Address.formatShort({ city: "", state: "" })).toBe("—");
		});

		test("should return only city when state is empty", () => {
			expect(Address.formatShort({ city: "Campinas", state: "" })).toBe(
				"Campinas",
			);
		});

		test("should return only state when city is empty", () => {
			expect(Address.formatShort({ city: "", state: "SP" })).toBe("SP");
		});
	});
});
