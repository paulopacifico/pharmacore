import { Id } from "@pharmacore/shared";
import { Branch, BranchErrors, UpdateBranchUseCase } from "../../src/";
import { MockBranchRepository } from "../data/mock-branch-repo";

describe("UpdateBranchUseCase", () => {
	let usecase: UpdateBranchUseCase;
	let branchRepository: MockBranchRepository;
	let existingBranch: Branch;

	beforeEach(() => {
		branchRepository = new MockBranchRepository();
		usecase = new UpdateBranchUseCase(branchRepository);

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

	test("should update a branch name successfully", async () => {
		const input = {
			id: existingBranch.id,
			name: "Farmácia Atualizada",
			address: existingBranch.props.address,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Branch);
		// expect(result.instance?.name).toBe("Farmácia Atualizada");
		// expect(result.instance?.id).toBe(existingBranch.id);
		expect(branchRepository.branches).toHaveLength(1);
	});

	test("should update a branch isActive status successfully", async () => {
		const input = {
			id: existingBranch.id,
			name: existingBranch.name,
			isActive: false,
			address: existingBranch.props.address,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Branch);
		// expect(result.instance?.isActive).toBe(false);
		// expect(result.instance?.name).toBe(existingBranch.name);
		// expect(result.instance?.id).toBe(existingBranch.id);
		expect(branchRepository.branches).toHaveLength(1);
	});

	test("should update a branch address successfully", async () => {
		const newAddress = {
			street: "Nova Rua",
			number: "456",
			complement: "Apto 202",
			neighborhood: "Jardim",
			city: "Rio de Janeiro",
			state: "RJ",
			zip: "20000-000",
			country: "Brasil",
		};

		const input = {
			id: existingBranch.id,
			name: existingBranch.name,
			isActive: existingBranch.isActive,
			address: newAddress,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Branch);
		// expect(result.instance?.address.city).toBe("Rio de Janeiro");
		// expect(result.instance?.address.street).toBe("Nova Rua");
		// expect(result.instance?.name).toBe(existingBranch.name);
		// expect(result.instance?.id).toBe(existingBranch.id);
	});

	test("should update multiple fields at once", async () => {
		const newAddress = {
			street: "Avenida Principal",
			number: "789",
			complement: "",
			neighborhood: "Centro",
			city: "Belo Horizonte",
			state: "MG",
			zip: "30000-000",
			country: "Brasil",
		};

		const input = {
			id: existingBranch.id,
			name: "Farmácia Nova",
			isActive: false,
			address: newAddress,
		};

		const result = await usecase.execute(input);

		expect(result.isOk).toBe(true);
		// expect(result.instance).toBeInstanceOf(Branch);
		// expect(result.instance?.name).toBe("Farmácia Nova");
		// expect(result.instance?.isActive).toBe(false);
		// expect(result.instance?.address.city).toBe("Belo Horizonte");
		// expect(result.instance?.address.street).toBe("Avenida Principal");
	});

	test("should fail if branch is not found", async () => {
		const nonExistentId = "non-existent-id";
		const input = {
			id: nonExistentId,
			name: "Farmácia Nova",
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toHaveLength(1);
		expect(result.errors?.[0]).toEqual(BranchErrors.NOT_FOUND);
		expect(branchRepository.branches).toHaveLength(1);
	});

	test("should fail if updated name is invalid", async () => {
		const input = {
			id: existingBranch.id,
			name: "AB",
			address: existingBranch.props.address,
		};

		const result = await usecase.execute(input);

		expect(result.isFailure).toBe(true);
		expect(result.errors).toBeDefined();
		expect(branchRepository.branches).toHaveLength(1);
	});
});
