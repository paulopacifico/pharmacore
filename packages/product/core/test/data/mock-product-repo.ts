import { Result } from "@pharmacore/shared";
import { Product } from "../../src/product/model/product.entity";
import { ProductRepository } from "../../src/product/provider/product.repository";
import { ProductErrors } from "../../src";
export class MockProductRepository implements ProductRepository {
	private products: Product[] = [];

	constructor() {
		this.initializeProducts();
	}
	delete(id: string): Promise<Result<void>> {
		throw new Error("Method not implemented.");
	}

	private initializeProducts(): void {
		const product1 = Product.create({
			id: "550e8400-e29b-41d4-a716-446655440001",
			name: "Dipirona",
			description: "Anti-inflamatório e analgésico de uso geral",
			price: 15.5,
			imagesURL: ["http://example.com/dipirona.jpg"],
		});

		const product2 = Product.create({
			id: "550e8400-e29b-41d4-a716-446655440002",
			name: "Omeprazol",
			description: "Medicamento para problemas de ácido estomacal",
			price: 42.3,
			imagesURL: ["http://example.com/omeprazol.jpg"],
		});

		const product3 = Product.create({
			id: "550e8400-e29b-41d4-a716-446655440003",
			name: "Vitamina C",
			description: "Suplemento vitamínico para imunidade",
			price: 25.0,
			imagesURL: ["http://example.com/vitaminac.jpg"],
		});

		this.products = [product1, product2, product3];
	}

	async create(entity: Product): Promise<Result<void>> {
		this.products.push(entity);
		return Result.ok();
	}

	async update(entity: Product): Promise<Result<void>> {
		const index = this.products.findIndex((p) => p.equals(entity));
		if (index === -1) {
			return Result.fail("PRODUCT_NOT_FOUND");
		}
		this.products[index] = entity;
		return Result.ok();
	}

	async findById(id: string): Promise<Result<Product>> {
		const product = this.products.find((p) =>
			p.equals({
				...p,
			} as any),
		);
		if (!product) {
			return Result.fail(ProductErrors.NOT_FOUND);
		}
		return Result.ok(product);
	}

	async findByName(name: string): Promise<Result<Product>> {
		const product = this.products.find((p) => p.name === name);
		if (!product) {
			return Result.fail(ProductErrors.NOT_FOUND);
		}
		return Result.ok(product);
	}

	async findAll(): Promise<Result<Product[]>> {
		return Result.ok(this.products);
	}
}
