import {
	Entity,
	EntityProps,
	Id,
	Number,
	Result,
	Sku,
} from "@pharmacore/shared";
import { MovementType } from "./movement-type.enum";
import { MovementReason } from "./movement-reason.enum";

export interface MovementProps extends EntityProps {
	skuItem: string;
	type: MovementType;
	quantity: number;
	reason: MovementReason;
	details?: string;
}

export class Movement extends Entity<Movement, MovementProps> {
	private constructor(props: MovementProps) {
		super(props);
	}

	get skuItem(): string {
		return this.props.skuItem;
	}
	get type(): MovementType {
		return this.props.type;
	}
	get quantity(): number {
		return this.props.quantity;
	}
	get reason(): MovementReason {
		return this.props.reason;
	}
	get details(): string | undefined {
		return this.props.details;
	}

	static createMovementOut(
		props: Omit<MovementProps, "type">,
	): Result<Movement> {
		return this.tryCreate({ ...props, type: MovementType.OUT });
	}

	static createMovementIn(
		props: Omit<MovementProps, "type">,
	): Result<Movement> {
		return this.tryCreate({ ...props, type: MovementType.IN });
	}

	static create(props: MovementProps): Movement {
		const result = this.tryCreate(props);
		result.throwIfFailed();
		return result.instance;
	}
	static tryCreate(props: MovementProps): Result<Movement> {
		const id = Id.tryCreate(props.id, {
			attribute: "Movement ID",
		});
		const skuItem = Sku.tryCreate(props.skuItem, {
			attribute: "Movement SKU Item",
		});
		const quantity = Number.tryCreate(props.quantity, {
			minValue: 1,
		});

		const attrs = Result.combine<any>([id, skuItem, quantity]);
		if (attrs.isFailure) {
			return Result.fail(attrs.errors!);
		}

		return Result.ok(
			new Movement({
				...props,
				id: id.instance.value,
				skuItem: skuItem.instance.value,
				quantity: quantity.instance.value,
				reason: props.reason,
				details: props.details,
				type: props.type,
			}),
		);
	}
}
