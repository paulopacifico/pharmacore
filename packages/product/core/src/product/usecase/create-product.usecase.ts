import { Alias, Result, UseCase } from "@pharmacore/shared";
import { ProductRepository } from "../provider/product.repository";
import { Product } from "../model/product.entity";
import { ProductCharacteristicProps } from "../model/product-characteristic.vo";
import { SubcategoryExistenceChecker } from "../provider";
import { SubcategoryErrors } from "../../category";

export interface CreateProductIn {
    name: string;
    description: string;
    imagesURL: string[];
    alias: string;
    price: number;
    sku: string;
    subcategoryId: string;
    brandId: string;
    characteristics: ProductCharacteristicProps[];
}

export class CreateProductUseCase implements UseCase<CreateProductIn, void> {
    constructor(
        private readonly repo: ProductRepository,
        private readonly subcategoryExistenceChecker: SubcategoryExistenceChecker,
    ) {}

    async execute(data: CreateProductIn): Promise<Result<void>> {
        const subcategoryValidation =
            await this.subcategoryExistenceChecker.subcategoryExists(
                data.subcategoryId,
            );

        if (subcategoryValidation.isFailure) {
            return Result.fail(SubcategoryErrors.NOT_FOUND);
        }

        const productResult = Product.tryCreate({
            ...data,
            alias: data.alias ?? Alias.fromText(data.name).value,
            characteristics: data.characteristics ?? [],
        });

        if (productResult.isFailure) {
            return productResult.withFail;
        }

        const product = productResult.instance;

        return await this.repo.create(product);
    }
}
