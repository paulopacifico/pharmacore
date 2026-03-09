import { CreateBranchUseCase } from "../../src";
import { MockBranchRepository } from "../data/mock-branch-repo";

describe("CreateBranchUseCase", () => {
    let usecase: CreateBranchUseCase;
    let repository: MockBranchRepository;

    beforeEach(() => {
        repository = new MockBranchRepository();
        usecase = new CreateBranchUseCase(repository);
    });

    test("should create a branch successfully", async () => {
        const input = {
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
        };

        const result = await usecase.execute(input);

        expect(result.isOk).toBe(true);
        // expect(result.instance).toBeInstanceOf(Branch);
        // expect(result.instance?.name).toBe("Farmácia Central");
        // expect(result.instance?.isActive).toBe(true);
        // expect(result.instance?.address.city).toBe("São Paulo");
        // expect(result.instance?.address.street).toBe("Rua Principal");
        // expect(repository.branches).toHaveLength(1);
        // expect(repository?.branches?.[0]?.id).toBe(result.instance?.id);
    });

    test("should fail if branch name is too short", async () => {
        const input = {
            name: "AB",
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
        };

        const result = await usecase.execute(input);

        expect(result.isFailure).toBe(true);
        expect(result.errors).toBeDefined();
        expect(repository.branches).toHaveLength(0);
    });

    test("should fail if branch name is empty", async () => {
        const input = {
            name: "",
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
        };

        const result = await usecase.execute(input);

        expect(result.isFailure).toBe(true);
        expect(result.errors).toBeDefined();
        expect(repository.branches).toHaveLength(0);
    });

    test("should create a branch with isActive false", async () => {
        const input = {
            name: "Farmácia Inativa",
            cnpj: "11222333000281",
            isActive: false,
            address: {
                street: "Rua Secundária",
                number: "456",
                complement: "",
                neighborhood: "Bairro",
                city: "Rio de Janeiro",
                state: "RJ",
                zip: "20000-000",
                country: "Brasil",
            },
        };

        const result = await usecase.execute(input);

        expect(result.isOk).toBe(true);
        // expect(result.instance).toBeInstanceOf(Branch);
        // expect(result.instance?.name).toBe("Farmácia Inativa");
        // expect(result.instance?.isActive).toBe(false);
        // expect(repository.branches).toHaveLength(1);
    });
});
