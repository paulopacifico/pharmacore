import { Result, UseCase } from "@pharmacore/shared";
import { ProductRepository } from "../provider/product.repository";
import { Product } from "../model/product.entity";
import { ProductCharacteristicProps } from "../model/product-characteristic.vo";
import { ProductErrors } from "../errors";
import { SubcategoryErrors, SubcategoryExistenceChecker } from "../..";

export interface UpdateProductIn {
    id: string;
    name: string;
    description: string;
    imagesURL: string[];
    price: number;
    sku: string;
    subcategoryId: string;
    brandId: string;
    alias: string;
    characteristics: ProductCharacteristicProps[];
}
export class UpdateProductUseCase implements UseCase<UpdateProductIn, void> {
    constructor(
        private readonly repo: ProductRepository,
        private readonly subcategoryExistenceChecker: SubcategoryExistenceChecker,
    ) {}

    async execute(data: UpdateProductIn): Promise<Result<void>> {
        const productResult = await this.repo.findById(data.id);

        if (productResult.isFailure) {
            return Result.fail(ProductErrors.NOT_FOUND);
        }

        if (data.subcategoryId) {
            const subcategoryValidation =
                await this.subcategoryExistenceChecker.subcategoryExists(
                    data.subcategoryId,
                );

            if (subcategoryValidation.isFailure) {
                return Result.fail(SubcategoryErrors.NOT_FOUND);
            }
        }

        const product = productResult.instance;

        const newProductProps = {
            ...product.props,
            name: data.name ?? product.props.name,
            description: data.description ?? product.props.description,
            imagesURL: data.imagesURL ?? product.props.imagesURL,
            price: data.price ?? product.props.price,
            sku: data.sku ?? product.props.sku,
            subcategoryId:
                data.subcategoryId ?? product.props.subcategoryId,
            brandId: data.brandId ?? product.props.brandId,
            alias: data.alias ?? product.props.alias,
            characteristics: data.characteristics ?? product.characteristics,
        };

        const updatedProductResult = Product.tryCreate(newProductProps);

        if (updatedProductResult.isFailure) {
            return updatedProductResult.withFail;
        }

        return await this.repo.update(updatedProductResult.instance);
    }
}
