import { CreateSnapshot } from "../../src/snapshot/usecase/create-snapshot.usecase";
import { MockSnapshotRepository } from "../data/mock-snapshot-repo";
import { Snapshot } from "../../src/snapshot/model/snapshot.entity";

describe("CreateSnapshot", () => {
	let usecase: CreateSnapshot;
	let snapshotRepository: MockSnapshotRepository;

	beforeEach(() => {
		snapshotRepository = new MockSnapshotRepository();
		usecase = new CreateSnapshot(snapshotRepository);
	});

	test("should create a snapshot successfully", async () => {
		const input = {
			skuItem: "ITEM-001",
			quantity: 100,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Snapshot);
		// expect(result.instance?.skuItem).toBe("ITEM-001");
		// expect(result.instance?.quantity).toBe(100);
		expect(snapshotRepository.snapshots).toHaveLength(1);
	});

	test("should fail if skuItem is empty", async () => {
		const input = {
			skuItem: "",
			quantity: 10,
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(snapshotRepository.snapshots).toHaveLength(0);
	});
});
