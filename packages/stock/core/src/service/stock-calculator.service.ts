import { Movement, MovementType } from "../movement";
import { Snapshot } from "../snapshot";

export class StockCalculator {
  static execute({
    movements,
    snapshot,
  }: {
    movements: Movement[];
    snapshot?: Snapshot | null;
  }) {
    let currentValue = snapshot?.quantity ?? 0;

    for (const m of movements) {
      switch (m.type) {
        case MovementType.IN:
          currentValue += m.quantity;
          break;
        case MovementType.OUT:
          currentValue -= m.quantity;
          break;
        default:
          break;
      }
    }

    return currentValue;
  }
}
