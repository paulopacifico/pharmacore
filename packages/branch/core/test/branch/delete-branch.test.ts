import { Id } from "@pharmacore/shared";
import { Branch, BranchErrors, DeleteBranchUseCase } from "../../src";
import { MockBranchRepository } from "../data/mock-branch-repo";

describe("DeleteBranchUseCase", () => {
	let usecase: DeleteBranchUseCase;
	let branchRepository: MockBranchRepository;
	let existingBranch: Branch;

	beforeEach(() => {
		branchRepository = new MockBranchRepository();
		usecase = new DeleteBranchUseCase(branchRepository);

		const branchResult = Branch.tryCreate({
			id: Id.tryCreate(undefined).instance.value,
			name: "Farmácia Central",
			cnpj: "11222333000181",
			isActive: true,
			address: {
				street: "Rua Principal",
				number: "123",
				complement: "Sala 101",
				neighborhood: "Centro",
				city: "São Paulo",
				state: "SP",
				zip: "01310-100",
				country: "Brasil",
			},
		});

		if (branchResult.isOk) {
			existingBranch = branchResult.instance;
			branchRepository.branches.push(existingBranch);
		}
	});

	test("should delete a branch successfully", async () => {
		const input = { id: existingBranch.id };

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		expect(branchRepository.branches).toHaveLength(0);
	});

	test("should fail if branch is not found", async () => {
		const nonExistentId = "non-existent-id";
		const input = { id: nonExistentId };

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(result.errors?.[0]).toEqual(BranchErrors.NOT_FOUND);
		expect(branchRepository.branches).toHaveLength(1);
	});
});
