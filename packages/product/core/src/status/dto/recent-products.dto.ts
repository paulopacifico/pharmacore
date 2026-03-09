export interface RecentProduct {
    name: string;
    sku: string;
    updatedAt: string | Date;
}

export interface RecentProductsDTO extends Array<RecentProduct> {}
