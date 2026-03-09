import { Result, UseCase } from "@pharmacore/shared";
import { ProductStatusDTO } from "../dto";
import {
    FindCategorySubcategoryRelationsQuery,
    FindKpiQuery,
    FindLastCreatedProductsQuery,
    FindLastDeletedProductsQuery,
} from "../provider";

export interface FindStatusOut extends ProductStatusDTO {}

export class FindStatusUseCase implements UseCase<void, FindStatusOut> {
    constructor(
        private readonly categorySubcategoryRelationsQuery: FindCategorySubcategoryRelationsQuery,
        private readonly kpiQuery: FindKpiQuery,
        private readonly lastCreatedProductsQuery: FindLastCreatedProductsQuery,
        private readonly lastDeletedProductsQuery: FindLastDeletedProductsQuery,
    ) {}

    async execute(): Promise<Result<FindStatusOut>> {
        const categorySubcategoryResult =
            await this.categorySubcategoryRelationsQuery.execute();
        const kpiResult = await this.kpiQuery.execute();
        const lastCreatedProductsResult =
            await this.lastCreatedProductsQuery.execute(5);
        const lastDeletedProductsResult =
            await this.lastDeletedProductsQuery.execute(5);

        const result = Result.combine([
            categorySubcategoryResult,
            kpiResult,
            lastCreatedProductsResult,
            lastDeletedProductsResult,
        ]);

        if (result.isFailure) {
            return result.withFail;
        }

        const output: FindStatusOut = {
            kpi: kpiResult.instance,
            categories: categorySubcategoryResult.instance,
            lastCreatedProducts: lastCreatedProductsResult.instance,
            lastDeletedProducts: lastDeletedProductsResult.instance,
        };

        return Result.ok(output);
    }
}
