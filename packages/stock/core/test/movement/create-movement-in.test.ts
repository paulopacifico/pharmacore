import { CreateMovementIn } from "../../src/movement/usecase/create-movement-in.usecase";
import { MockMovementRepository } from "../data/mock-movement-repo";
import { MockStockItemRepository } from "../data/mock-stock-item-repo";
import { StockItem } from "../../src/stock-item";
import { Id } from "@pharmacore/shared";
import { MovementReason } from "../../src";

describe("CreateMovementIn", () => {
	const sku1 = "PARACETAMOL-750MG-30CP";
	const sku2 = "SHX-00123";
	let usecase: CreateMovementIn;
	let movementRepository: MockMovementRepository;
	let stockItemRepository: MockStockItemRepository;

	beforeEach(() => {
		movementRepository = new MockMovementRepository();
		stockItemRepository = new MockStockItemRepository();
		usecase = new CreateMovementIn(movementRepository, stockItemRepository);
	});

	test("should create a new stock item and a movement if it's the first one", async () => {
		const input = {
			sku: sku2,
			stockId: Id.tryCreate(undefined).instance.value,
			quantity: 10,
			reason: MovementReason.PURCHASE,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		expect(stockItemRepository.stockItems).toHaveLength(1);
		const newStockItem = stockItemRepository.stockItems[0];
		expect(newStockItem?.sku).toBe(input.sku);
		expect(newStockItem?.stockId).toBe(input.stockId);

		expect(movementRepository.movements).toHaveLength(1);
		const newMovement = movementRepository.movements[0];
		expect(newMovement?.skuItem).toBe(newStockItem?.sku);
		expect(newMovement?.quantity).toBe(10);
		expect(newMovement?.reason).toBe(MovementReason.PURCHASE);
	});

	test("should use existing stock item and create a new movement", async () => {
		const stockId = Id.tryCreate(undefined).instance.value;
		const existingStockItem = StockItem.create({
			sku: sku1,
			stockId: stockId,
		});
		stockItemRepository.stockItems.push(existingStockItem);

		const input = {
			sku: sku1,
			stockId: stockId,
			quantity: 5,
			reason: MovementReason.PURCHASE,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		expect(stockItemRepository.stockItems).toHaveLength(1);

		expect(movementRepository.movements).toHaveLength(1);
		const newMovement = movementRepository.movements[0];
		expect(newMovement?.skuItem).toBe(existingStockItem.sku);
		expect(newMovement?.quantity).toBe(5);
	});

	test("should fail if quantity is zero or less", async () => {
		const input = {
			sku: sku1,
			stockId: Id.tryCreate(undefined).instance.value,
			quantity: 0,
			reason: MovementReason.PURCHASE,
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(stockItemRepository.stockItems).toHaveLength(0);
		expect(movementRepository.movements).toHaveLength(0);
	});
});
