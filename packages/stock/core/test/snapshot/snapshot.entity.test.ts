import { Id } from "@pharmacore/shared";
import {
  Snapshot,
  SnapshotProps,
} from "../../src/snapshot/model/snapshot.entity";

describe("Snapshot Entity", () => {
  let validProps: SnapshotProps;

  beforeEach(() => {
    validProps = {
      id: Id.tryCreate(undefined).instance.value,
      skuItem: "PARACETAMOL-750MG-30CP",
      quantity: 100,
      processedAt: new Date(),
    };
  });

  describe("creation", () => {
    it("should create a snapshot with valid props using tryCreate", () => {
      const result = Snapshot.tryCreate(validProps);
      expect(result.isOk).toBe(true);
      const instance = result.instance;
      expect(instance).toBeInstanceOf(Snapshot);
      expect(instance.skuItem).toBe(validProps.skuItem);
      expect(instance.quantity).toBe(validProps.quantity);
      expect(instance.processedAt).toBe(validProps.processedAt);
    });

    it("should create a snapshot with a generated processedAt date if not provided", () => {
      const { processedAt, ...propsWithoutProcessedAt } = validProps;
      const result = Snapshot.tryCreate(
        propsWithoutProcessedAt as SnapshotProps,
      );
      expect(result.isOk).toBe(true);
      expect(result.instance.processedAt).toBeInstanceOf(Date);
    });

    it("should fail if quantity is not a valid number (e.g., NaN)", () => {
      const invalidProps = { ...validProps, quantity: NaN };
      const result = Snapshot.tryCreate(invalidProps);
      expect(result.isFailure).toBe(true);
    });

    it("should create a snapshot successfully even with zero quantity", () => {
      const propsWithZeroQuantity = { ...validProps, quantity: 0 };
      const result = Snapshot.tryCreate(propsWithZeroQuantity);
      expect(result.isOk).toBe(true);
      expect(result.instance.quantity).toBe(0);
    });
  });

  describe("getters", () => {
    it("should return correct stockItemId", () => {
      const snapshot = Snapshot.create(validProps);
      expect(snapshot.skuItem).toBe(validProps.skuItem);
    });

    it("should return correct quantity", () => {
      const snapshot = Snapshot.create(validProps);
      expect(snapshot.quantity).toBe(validProps.quantity);
    });

    it("should return correct processedAt date", () => {
      const snapshot = Snapshot.create(validProps);
      expect(snapshot.processedAt).toBe(validProps.processedAt);
    });
  });

  describe("equality", () => {
    it("should be equal if ids are the same", () => {
      const id = Id.tryCreate().instance.value;
      const s1 = Snapshot.create({ ...validProps, id });
      const s2 = Snapshot.create({ ...validProps, id, quantity: 200 });
      expect(s1.equals(s2)).toBe(true);
    });

    it("should not be equal if ids are different", () => {
      const s1 = Snapshot.create(validProps);
      const s2 = Snapshot.create({
        ...validProps,
        id: Id.tryCreate(undefined).instance.value,
      });
      expect(s1.notEquals(s2)).toBe(true);
    });
  });
});
