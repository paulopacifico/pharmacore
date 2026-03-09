import { Cnpj } from "../../src";

describe("Cnpj", () => {
  const VALID_CNPJ_DIGITS = "11222333000181";
  const VALID_CNPJ_FORMATTED = "11.222.333/0001-81";

  it("should create with valid cnpj digits", () => {
    const result = Cnpj.tryCreate(VALID_CNPJ_DIGITS);

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(VALID_CNPJ_DIGITS);
  });

  it("should normalize formatted cnpj to digits", () => {
    const result = Cnpj.tryCreate(VALID_CNPJ_FORMATTED);

    expect(result.isOk).toBe(true);
    expect(result.instance.value).toBe(VALID_CNPJ_DIGITS);
  });

  it("should expose formatted getter", () => {
    const cnpj = Cnpj.create(VALID_CNPJ_DIGITS);

    expect(cnpj.formatted).toBe(VALID_CNPJ_FORMATTED);
  });

  it("should format static helper when input has 14 digits", () => {
    expect(Cnpj.format(VALID_CNPJ_DIGITS)).toBe(VALID_CNPJ_FORMATTED);
    expect(Cnpj.format(VALID_CNPJ_FORMATTED)).toBe(VALID_CNPJ_FORMATTED);
  });

  it("should return original value in format helper when length is not 14", () => {
    expect(Cnpj.format("123")).toBe("123");
    expect(Cnpj.format("abc")).toBe("abc");
  });

  it("should fail when cnpj has invalid length", () => {
    const result = Cnpj.tryCreate("1234567890123");

    expect(result.isFailure).toBe(true);
    expect(result.errors?.[0]).toBe("INVALID_CNPJ");
  });

  it("should fail when cnpj is a repeated sequence", () => {
    const result = Cnpj.tryCreate("11111111111111");

    expect(result.isFailure).toBe(true);
    expect(result.errors?.[0]).toBe("INVALID_CNPJ");
  });

  it("should fail when value is undefined", () => {
    const result = Cnpj.tryCreate(undefined as unknown as string);

    expect(result.isFailure).toBe(true);
    expect(result.errors?.[0]).toBe("INVALID_CNPJ");
  });

  it("should throw when create receives invalid cnpj", () => {
    expect(() => Cnpj.create("invalid")).toThrow("INVALID_CNPJ");
  });
});
