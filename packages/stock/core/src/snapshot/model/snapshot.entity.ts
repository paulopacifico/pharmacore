import {
  Entity,
  EntityProps,
  Id,
  Number,
  Result,
  Sku,
} from "@pharmacore/shared";

export interface SnapshotProps extends EntityProps {
  skuItem: string;
  quantity: number;
  processedAt?: Date;
}

export class Snapshot extends Entity<Snapshot, SnapshotProps> {
  private constructor(props: SnapshotProps) {
    super(props);
  }

  get skuItem(): string {
    return this.props.skuItem;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get processedAt(): Date {
    return this.props.processedAt!;
  }

  static create(props: SnapshotProps): Snapshot {
    const result = this.tryCreate(props);
    result.throwIfFailed();

    return result.instance;
  }

  static tryCreate(props: SnapshotProps): Result<Snapshot> {
    const id = Id.tryCreate(props.id, {
      attribute: "Snapshot ID",
    });
    const skuItem = Sku.tryCreate(props.skuItem, {
      attribute: "Snapshot SKU Item",
    });
    const quantity = Number.tryCreate(props.quantity, {
      minValue: 0,
    });
    const attrs = Result.combine<any>([id, skuItem, quantity]);
    if (attrs.isFailure) {
      return Result.fail(attrs.errors!);
    }
    return Result.ok(
      new Snapshot({
        ...props,
        id: id.instance.value,
        skuItem: skuItem.instance.value,
        quantity: quantity.instance.value,
        processedAt: props?.processedAt || new Date(),
      }),
    );
  }
}
