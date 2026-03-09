import { Entity, EntityProps, Id, Result, Text } from "@pharmacore/shared";
import { Location, LocationProps } from "../../location";

export interface StockProps extends EntityProps {
  name: string;
  location: LocationProps;
}

export class Stock extends Entity<Stock, StockProps> {
  private constructor(props: StockProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }
  get location(): Location {
    return Location.create(this.props.location);
  }

  static create(props: StockProps): Stock {
    const result = this.tryCreate(props);
    result.throwIfFailed();
    return result.instance;
  }

  static tryCreate(props: StockProps): Result<Stock> {
    const id = Id.tryCreate(props.id, {
      attribute: "Stock ID",
    });
    const name = Text.tryCreate(props.name, {
      maxLength: 100,
      minLength: 3,
    });
    const location = Location.tryCreate(props.location);

    const attrs = Result.combine<any>([id, name, location]);
    if (attrs.isFailure) {
      return Result.fail(attrs.errors!);
    }

    return Result.ok(
      new Stock({
        ...props,
        id: id.instance.value,
        name: name.instance.value,
        location: location.instance.props,
      }),
    );
  }
}
