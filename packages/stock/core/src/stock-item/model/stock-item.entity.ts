import { Entity, EntityProps, Id, Result, Sku } from "@pharmacore/shared";

export interface StockItemProps extends EntityProps {
  stockId: string;
  sku: string;
  name?: string;
}

export class StockItem extends Entity<StockItem, StockItemProps> {
  private constructor(props: StockItemProps) {
    super(props);
  }

  get stockId(): string {
    return this.props.stockId;
  }

  get name(): string | undefined {
    return this.props.name;
  }
  get sku(): string {
    return this.props.sku;
  }

  static create(props: StockItemProps): StockItem {
    const result = this.tryCreate(props);
    result.throwIfFailed();
    return result.instance;
  }

  static tryCreate(props: StockItemProps): Result<StockItem> {
    const id = Id.tryCreate(props.id, {
      attribute: "StockItem ID",
    });
    const stockId = Id.required(props.stockId, {
      attribute: "Stock ID",
    });
    const sku = Sku.tryCreate(props.sku, { attribute: "StockItem SKU" });

    const attrs = Result.combine<any>([id, stockId, sku]);

    if (attrs.isFailure) {
      return Result.fail(attrs.errors!);
    }

    return Result.ok(
      new StockItem({
        ...props,
        id: id.instance.value,
        stockId: stockId.instance.value,
        sku: sku.instance.value,
      }),
    );
  }
}
