import { Id } from "@pharmacore/shared";
import { Branch, BranchProps } from "../../src";

describe("Branch Entity", () => {
    let validProps: BranchProps;

    beforeEach(() => {
        validProps = {
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
        };
    });

    describe("creation", () => {
        it("should create with valid props", () => {
            const result = Branch.tryCreate(validProps);
            expect(result.isOk).toBe(true);
            const branch = result.instance;
            expect(branch).toBeInstanceOf(Branch);
            expect(branch.name).toBe("Farmácia Central");
            expect(branch.isActive).toBe(true);
            expect(branch.address.street).toBe("Rua Principal");
            expect(branch.address.city).toBe("São Paulo");
            expect(branch.id).toBeDefined();
            expect(branch.createdAt).toBeInstanceOf(Date);
        });

        it("should fail if name is invalid (too short)", () => {
            const result = Branch.tryCreate({ ...validProps, name: "AB" });
            expect(result.isFailure).toBe(true);
        });

        it("should fail if name is empty", () => {
            const result = Branch.tryCreate({ ...validProps, name: "" });
            expect(result.isFailure).toBe(true);
        });

        it("should create with generated id when not provided", () => {
            const { id, ...propsWithoutId } = validProps;
            const result = Branch.tryCreate(propsWithoutId as BranchProps);
            expect(result.isOk).toBe(true);
            expect(result.instance.id).toBeDefined();
        });

        it("should create with isActive false", () => {
            const result = Branch.tryCreate({ ...validProps, isActive: false });
            expect(result.isOk).toBe(true);
            expect(result.instance.isActive).toBe(false);
        });

        it("should fail if cnpj is invalid", () => {
            const result = Branch.tryCreate({ ...validProps, cnpj: "123" });
            expect(result.isFailure).toBe(true);
        });
    });

    describe("cloneWith", () => {
        it("should clone the entity with a new name", () => {
            const branch = Branch.create(validProps);
            const result = branch.cloneWith({ name: "Nova Farmácia" });

            expect(result.isOk).toBe(true);
            const clonedBranch = result.instance;

            expect(clonedBranch).not.toBe(branch);
            expect(clonedBranch.name).toBe("Nova Farmácia");
            expect(branch.name).toBe("Farmácia Central");
            expect(clonedBranch.id).toBe(branch.id);
        });

        it("should clone the entity with new address", () => {
            const branch = Branch.create(validProps);
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
            const result = branch.cloneWith({ address: newAddress });

            expect(result.isOk).toBe(true);
            const clonedBranch = result.instance;

            expect(clonedBranch.address.city).toBe("Rio de Janeiro");
            expect(clonedBranch.address.street).toBe("Nova Rua");
            expect(branch.address.city).toBe("São Paulo");
        });
    });
});
