import { Id } from "@pharmacore/shared";
import {
	Location,
	LocationProps,
	Stock,
	StockProps,
	StockItemProps,
} from "../../src/";

describe("Stock Entity", () => {
	const sku1 = "PARACETAMOL-750MG-30CP";
	const sku2 = "SHX-00123";
	let validLocationProps: LocationProps;
	let validStockItemProps1: StockItemProps;
	let validStockItemProps2: StockItemProps;
	let validStockProps: StockProps;

	beforeEach(() => {
		const stockId = Id.tryCreate(undefined).instance.value;

		validLocationProps = {
			id: Id.tryCreate(undefined).instance.value,
			name: "Main Warehouse",
			address: "123 Industrial Ave",
			isActive: true,
		};

		validStockItemProps1 = {
			id: Id.tryCreate(undefined).instance.value,
			stockId: stockId,
			sku: sku1,
		};

		validStockItemProps2 = {
			id: Id.tryCreate(undefined).instance.value,
			stockId: stockId,
			sku: sku2,
		};

		validStockProps = {
			id: stockId,
			name: "Central Stock",
			location: validLocationProps,
		};
	});

	describe("creation", () => {
		it("should create with valid props", () => {
			const result = Stock.tryCreate(validStockProps);
			expect(result.isOk).toBe(true);
			const stock = result.instance;
			expect(stock).toBeInstanceOf(Stock);
			expect(stock.name).toBe("Central Stock");
			expect(stock.location).toBeInstanceOf(Location);
		});

		it("should fail if name is invalid", () => {
			const result = Stock.tryCreate({ ...validStockProps, name: "a" });
			expect(result.isFailure).toBe(true);
		});
	});

	describe("cloneWith", () => {
		it("should clone the entity with a new name", () => {
			const stock = Stock.create(validStockProps);
			const result = stock.cloneWith({ name: "New Stock Name" });

			expect(result.isOk).toBe(true);
			const clonedStock = result.instance;

			expect(clonedStock).not.toBe(stock);
			expect(clonedStock.name).toBe("New Stock Name");
			expect(stock.name).toBe("Central Stock");
		});
	});
});
