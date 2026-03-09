import { Entity, EntityProps, Id, Name, Result } from "@pharmacore/shared";

export interface LocationProps extends EntityProps {
  name: string;
  address: string;
  isActive: boolean;
}

export class Location extends Entity<Location, LocationProps> {
  private constructor(props: LocationProps) {
    super(props);
  }

  get name(): string {
    return this.props.name;
  }
  get address(): string {
    return this.props.address;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }

  static create(props: LocationProps): Location {
    const result = Location.tryCreate(props);
    result.throwIfFailed();
    return result.instance;
  }

  static tryCreate(props: LocationProps): Result<Location> {
    const id = Id.tryCreate(props.id);
    const name = Name.tryCreate(props.name);
    const isActive = props.isActive;

    const attributes = Result.combine<any>([id, name]);
    if (attributes.isFailure) {
      return Result.fail(attributes.errors!);
    }

    return Result.ok(
      new Location({
        ...props,
        id: id.instance.value,
        name: name.instance.value,
        address: props.address,
        isActive,
      }),
    );
  }
}
