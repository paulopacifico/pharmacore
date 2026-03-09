import { StockRepository, Stock, StockError } from "../../src/stock";
import { Result } from "@pharmacore/shared";

export class MockStockRepository implements StockRepository {
	public stocks: Stock[] = [];

	async create(stock: Stock): Promise<Result<void>> {
		this.stocks.push(stock);
		return Promise.resolve(Result.ok(undefined));
	}

	async update(stock: Stock): Promise<Result<void>> {
		const index = this.stocks.findIndex((s) => s.id === stock.id);
		if (index === -1) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		this.stocks[index] = stock;
		return Promise.resolve(Result.ok(undefined));
	}

	async findById(id: string): Promise<Result<Stock>> {
		const s = this.stocks.find((s) => s.id === id) || null;
		if (!s) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		return Promise.resolve(Result.ok(s));
	}

	async findAll(): Promise<Result<Stock[]>> {
		return Promise.resolve(Result.ok([...this.stocks]));
	}

	async delete(id: string): Promise<Result<void>> {
		const index = this.stocks.findIndex((s) => s.id === id);
		if (index === -1) {
			return Promise.resolve(Result.fail(StockError.NOT_FOUND));
		}
		this.stocks.splice(index, 1);
		return Promise.resolve(Result.ok(undefined));
	}

	reset() {
		this.stocks = [];
	}
}
