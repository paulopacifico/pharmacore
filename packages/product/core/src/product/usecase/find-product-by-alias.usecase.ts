import { Price, Result, UseCase } from "@pharmacore/shared";
import { ProductDetailsDTO } from "../dto";
import { FindProductDetailsByAliasQuery } from "../provider";
import { ProductErrors } from "../errors";

export interface FindProductByAliasIn {
    alias: string;
}

export interface FindProductByAliasOut extends ProductDetailsDTO {}

export class FindProductByAliasUseCase implements UseCase<
    FindProductByAliasIn,
    FindProductByAliasOut | null
> {
    constructor(private readonly query: FindProductDetailsByAliasQuery) {}

    async execute({
        alias,
    }: FindProductByAliasIn): Promise<Result<FindProductByAliasOut | null>> {
        const productResult = await this.query.execute(alias);

        if (productResult.isFailure) {
            return Result.fail(ProductErrors.NOT_FOUND);
        }

        const product = {
            ...productResult.instance,
            formattedPrice: Price.create(productResult.instance!.price)
                .formattedValue,
        };

        return Result.ok(product as FindProductByAliasOut);
    }
}
