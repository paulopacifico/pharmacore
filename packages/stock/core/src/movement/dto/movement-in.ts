import { MovementReason } from "../model";

export interface MovementIn {
	sku: string;
	stockId: string;
	quantity: number;
	reason: MovementReason;
}
