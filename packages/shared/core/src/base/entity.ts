import { Id } from "../vo/id.vo";
import { Result } from "./result";

export interface EntityProps {
  id?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

export abstract class Entity<Type, Props extends EntityProps> {
  readonly props: Props;
  readonly id: string;

  protected constructor(props: Props) {
    const id = Id.create(props.id!, { attribute: "id" }).value;
    this.id = id;
    this.props = {
      ...props,
      id,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      deletedAt: props.deletedAt ?? null,
    };
  }
  get createdAt() { return this.props.createdAt! }
  get updatedAt() { return this.props.updatedAt! }
  get deletedAt() { return this.props?.deletedAt ?? null }

  equals(entity: Entity<Type, Props>): boolean {
    return this.id === entity.id;
  }

  notEquals(entity: Entity<Type, Props>): boolean {
    return this.id !== entity.id;
  }

  public cloneWith(overrrides: Partial<Props>): Result<Type> {
    const props = this.toProps();
    const merged = this.deepMerge(structuredClone(props), overrrides);
    return (this.constructor as any).tryCreate(merged);
  }

  private deepMerge(target: any, source: any): any {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        if (!target[key]) target[key] = {};
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  private toProps(): Props {
    return this.props;
  }

  toJSON() {
    return this.props;
  }
}
