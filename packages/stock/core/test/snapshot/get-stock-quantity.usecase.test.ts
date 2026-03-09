import { GetStockQuantity } from "../../src/snapshot/usecase/get-stock-quantity.usecase";
import { MockSnapshotRepository } from "../data/mock-snapshot-repo";
import { MockMovementRepository } from "../data/mock-movement-repo";
import { Movement, MovementReason, MovementType } from "../../src/movement";
import { Snapshot } from "../../src/snapshot";
import { StockCalculator } from "../../src/service";

jest.mock("../../src/service/stock-calculator.service", () => ({
  StockCalculator: {
    execute: jest.fn(({ movements, snapshot }) => {
      const snapshotQuantity = snapshot?.quantity || 0;
      const movementsQuantity = movements.reduce((acc: any, mov: any) => {
        return mov.type === MovementType.IN
          ? acc + mov.quantity
          : acc - mov.quantity;
      }, 0);
      return snapshotQuantity + movementsQuantity;
    }),
  },
}));

describe("GetStockQuantity UseCase", () => {
  let usecase: GetStockQuantity;
  let mockSnapshotRepo: MockSnapshotRepository;
  let mockMovementRepo: MockMovementRepository;

  const sku = "PARACETAMOL-750MG-30CP";

  beforeEach(() => {
    mockSnapshotRepo = new MockSnapshotRepository();
    mockMovementRepo = new MockMovementRepository();
    usecase = new GetStockQuantity(mockSnapshotRepo, mockMovementRepo);
    (StockCalculator.execute as jest.Mock).mockClear();
  });

  test("should calculate quantity from movements when no snapshot exists", async () => {
    mockMovementRepo.movements = [
      Movement.tryCreate({
        skuItem: sku,
        type: MovementType.IN,
        quantity: 10,
        reason: MovementReason.PURCHASE,
      }).instance,
      Movement.tryCreate({
        skuItem: sku,
        type: MovementType.OUT,
        quantity: 3,
        reason: MovementReason.SALE,
      }).instance,
    ];

    const result = await usecase.execute({ sku });

    expect(result.isOk).toBe(true);
    const snapshot = result.instance as Snapshot;
    expect(snapshot.quantity).toBe(7);
    expect(snapshot.skuItem).toBe(sku);
  });

  test("should calculate quantity from the latest snapshot and subsequent movements", async () => {
    const processedAt = new Date(Date.now() - 1000 * 60 * 5);
    mockSnapshotRepo.snapshots = [
      Snapshot.tryCreate({ skuItem: sku, quantity: 100, processedAt }).instance,
    ];

    mockMovementRepo.movements = [
      Movement.tryCreate({
        skuItem: sku,
        type: MovementType.IN,
        quantity: 20,
        createdAt: new Date(),
        reason: MovementReason.PURCHASE,
      }).instance,
      Movement.tryCreate({
        skuItem: sku,
        type: MovementType.OUT,
        quantity: 5,
        createdAt: new Date(),
        reason: MovementReason.ADJUSTMENT,
      }).instance,
    ];

    const result = await usecase.execute({ sku });

    expect(result.isOk).toBe(true);
    const snapshot = result.instance as Snapshot;
    expect(snapshot.quantity).toBe(115);
    expect(snapshot.skuItem).toBe(sku);
  });

  test("should return a snapshot with quantity 0 if no movements or snapshot exist", async () => {
    const result = await usecase.execute({ sku });

    expect(result.isOk).toBe(true);
    const snapshot = result.instance as Snapshot;
    expect(snapshot.quantity).toBe(0);
    expect(snapshot.skuItem).toBe(sku);
  });

  test("should calculate quantity correctly when only a snapshot exists", async () => {
    const processedAt = new Date();
    mockSnapshotRepo.snapshots = [
      Snapshot.tryCreate({ skuItem: sku, quantity: 50, processedAt }).instance,
    ];

    const result = await usecase.execute({ sku });

    expect(result.isOk).toBe(true);
    const snapshot = result.instance as Snapshot;
    expect(snapshot.quantity).toBe(50);
    expect(snapshot.skuItem).toBe(sku);
  });
});

