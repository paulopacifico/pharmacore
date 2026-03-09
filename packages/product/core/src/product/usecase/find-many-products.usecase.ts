import { Price, Result, UseCase } from "@pharmacore/shared";
import { ProductListDTO, ProductQueryDTO } from "../dto";
import { FindManyProductsWithFiltersQuery } from "../..";

export type FindManyProductsIn = ProductQueryDTO;

export interface FindManyProductsOut extends ProductListDTO {}

export class FindManyProductsUseCase implements UseCase<
    FindManyProductsIn,
    FindManyProductsOut
> {
    constructor(private readonly query: FindManyProductsWithFiltersQuery) {}

    async execute(input: FindManyProductsIn): Promise<Result<FindManyProductsOut>> {
        const productsResult = await this.query.execute(input);

        if (productsResult.isFailure) {
            return productsResult.withFail;
        }

        const instance = productsResult.instance!;

        const data = instance.data.map((product) => ({
            ...product,
            formattedPrice: Price.create(product.price).formattedValue,
        }));

        return Result.ok({
            data,
            meta: instance.meta,
        });
    }
}
