import { Id } from "@pharmacore/shared";
import {
  Movement,
  MovementProps,
} from "../../src/movement/model/movement.entity";
import { MovementType } from "../../src/movement/model/movement-type.enum";
import { MovementReason } from "../../src";

describe("Movement Entity", () => {
  let validProps: Omit<MovementProps, "type">;

  beforeEach(() => {
    validProps = {
      skuItem: Id.tryCreate(undefined).instance.value,
      quantity: 10,
      reason: MovementReason.PURCHASE,
    };
  });

  describe("creation", () => {
    it("should create with valid props using tryCreate", () => {
      const result = Movement.tryCreate({
        ...validProps,
        type: MovementType.IN,
      });
      expect(result.isOk).toBe(true);
      const instance = result.instance;
      expect(instance).toBeInstanceOf(Movement);
      expect(instance.quantity).toBe(10);
      expect(instance.type).toBe(MovementType.IN);
    });

    it("should create a movement IN using the specific static method", () => {
      const result = Movement.createMovementIn(validProps);
      expect(result.isOk).toBe(true);
      expect(result.instance.type).toBe(MovementType.IN);
    });

    it("should create a movement OUT using the specific static method", () => {
      const result = Movement.createMovementOut({
        ...validProps,
        reason: MovementReason.SALE,
      });
      expect(result.isOk).toBe(true);
      expect(result.instance.type).toBe(MovementType.OUT);
    });

    it("should fail if quantity is zero or less", () => {
      const resultZero = Movement.tryCreate({
        ...validProps,
        quantity: 0,
        type: MovementType.IN,
      });
      const resultNegative = Movement.tryCreate({
        ...validProps,
        quantity: -1,
        type: MovementType.IN,
      });
      expect(resultZero.isFailure).toBe(true);
      expect(resultNegative.isFailure).toBe(true);
    });

    it("should fail if stockItemId is not provided", () => {
      const result = Movement.tryCreate({
        ...validProps,
        skuItem: "",
        type: MovementType.IN,
      });
      expect(result.isFailure).toBe(true);
    });
  });

  describe("equality", () => {
    it("should be equal if ids are the same", () => {
      const id = Id.tryCreate(undefined).instance.value;
      const m1 = Movement.create({ ...validProps, id, type: MovementType.IN });
      const m2 = Movement.create({
        ...validProps,
        id,
        type: MovementType.OUT,
        reason: MovementReason.SALE,
      });
      expect(m1.equals(m2)).toBe(true);
    });

    it("should not be equal if ids are different", () => {
      const m1 = Movement.create({ ...validProps, type: MovementType.IN });
      const m2 = Movement.create({ ...validProps, type: MovementType.IN });
      expect(m1.notEquals(m2)).toBe(true);
    });
  });
});
