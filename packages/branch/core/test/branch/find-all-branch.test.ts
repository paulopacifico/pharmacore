import { Id } from "@pharmacore/shared";
import { MockBranchRepository } from "../data/mock-branch-repo";
import { Branch, FindManyBranchesUseCase } from "../../src";

describe("FindManyBranchesUseCase", () => {
    let usecase: FindManyBranchesUseCase;
    let branchRepository: MockBranchRepository;

    beforeEach(() => {
        branchRepository = new MockBranchRepository();
        usecase = new FindManyBranchesUseCase(branchRepository.findMany);
    });

    test("should find all branches successfully", async () => {
        const branch1 = Branch.tryCreate({
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
        }).instance;

        const branch2 = Branch.tryCreate({
            id: Id.tryCreate(undefined).instance.value,
            name: "Farmácia Norte",
            cnpj: "11222333000281",
            isActive: true,
            address: {
                street: "Avenida Norte",
                number: "456",
                complement: "",
                neighborhood: "Zona Norte",
                city: "São Paulo",
                state: "SP",
                zip: "02000-000",
                country: "Brasil",
            },
        }).instance;

        if (branch1 && branch2) {
            branchRepository.branches.push(branch1, branch2);
        }

        const result = await usecase.execute({ page: 1, pageSize: 10 });

        expect(result.isOk).toBe(true);
        expect(result.instance?.data).toHaveLength(2);
        expect(result.instance?.data?.[0]?.name).toBe("Farmácia Central");
        expect(result.instance?.data?.[1]?.name).toBe("Farmácia Norte");
        expect(result.instance?.meta).toEqual({
            page: 1,
            pageSize: 10,
            total: 2,
            totalPages: 1,
        });
    });

    test("should return an empty array if no branches exist", async () => {
        const result = await usecase.execute({ page: 1, pageSize: 10 });

        expect(result.isOk).toBe(true);
        expect(result.instance?.data).toHaveLength(0);
        expect(result.instance?.meta.total).toBe(0);
        expect(result.instance?.meta.totalPages).toBe(0);
    });

    test("should paginate results correctly", async () => {
        for (let i = 0; i < 5; i++) {
            const branch = Branch.tryCreate({
                id: Id.tryCreate(undefined).instance.value,
                name: `Farmácia ${i + 1}`,
                cnpj: `1122233300${String(i + 1).padStart(2, "0")}81`,
                isActive: true,
                address: {
                    street: "Rua Teste",
                    number: String(i + 1),
                    complement: "",
                    neighborhood: "Centro",
                    city: "São Paulo",
                    state: "SP",
                    zip: "01310-100",
                    country: "Brasil",
                },
            }).instance;
            if (branch) branchRepository.branches.push(branch);
        }

        const page1 = await usecase.execute({ page: 1, pageSize: 2 });
        expect(page1.instance?.data).toHaveLength(2);
        expect(page1.instance?.meta.total).toBe(5);
        expect(page1.instance?.meta.totalPages).toBe(3);
        expect(page1.instance?.meta.page).toBe(1);

        const page2 = await usecase.execute({ page: 2, pageSize: 2 });
        expect(page2.instance?.data).toHaveLength(2);
        expect(page2.instance?.meta.page).toBe(2);

        const page3 = await usecase.execute({ page: 3, pageSize: 2 });
        expect(page3.instance?.data).toHaveLength(1);
        expect(page3.instance?.meta.page).toBe(3);
    });
});
