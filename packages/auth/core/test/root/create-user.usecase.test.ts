import { Result } from "@pharmacore/shared";
import { CreateUserUseCase } from "../../src/root/create-user.usercase";
import { UserRepository } from "../../src/user";
import { PasswordRepository, PasswordProvider } from "../../src/password";
import { RoleRepository } from "../../src/role";
import { UserErrors } from "../../src/user/errors";
import { RoleErrors } from "../../src/role/errors";
import { Role } from "../../src/role/model/role.entity";

const USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const ROLE_ID = "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";

const mockUserRepo: jest.Mocked<UserRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    updateRoles: jest.fn(),
};

const mockPassRepo: jest.Mocked<PasswordRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
};

const mockRoleRepo: jest.Mocked<RoleRepository> = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
};

const mockPasswordProvider: jest.Mocked<PasswordProvider> = {
    hash: jest.fn(),
    compare: jest.fn(),
};

const defaultRole = Role.create({
    id: ROLE_ID,
    name: "colaborador",
    description: "Default role",
    permissionIds: [],
});

const validInput = {
    name: "João Silva",
    email: "joao@example.com",
    password: "StrongPass1!",
};

describe("CreateUserUseCase", () => {
    let useCase: CreateUserUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new CreateUserUseCase(
            mockUserRepo,
            mockPassRepo,
            mockRoleRepo,
            mockPasswordProvider,
        );
    });

    it("should fail when email already exists", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(
            Result.ok({ id: USER_ID } as any),
        );

        const result = await useCase.execute(validInput);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe(UserErrors.EMAIL_ALREADY_EXISTS);
    });

    it("should propagate non-NOT_FOUND error from findByEmail", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(Result.fail("DB_ERROR"));

        const result = await useCase.execute(validInput);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe("DB_ERROR");
    });

    it("should fail when default role is not found", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(
            Result.fail(UserErrors.NOT_FOUND),
        );
        mockRoleRepo.findByName.mockResolvedValue(
            Result.fail(RoleErrors.NOT_FOUND),
        );

        const result = await useCase.execute(validInput);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe(RoleErrors.NOT_FOUND);
    });

    it("should fail when userRepo.create fails", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(
            Result.fail(UserErrors.NOT_FOUND),
        );
        mockRoleRepo.findByName.mockResolvedValue(Result.ok(defaultRole));
        mockPasswordProvider.hash.mockResolvedValue("HashedPass1!");
        mockUserRepo.create.mockResolvedValue(Result.fail("CREATE_ERROR"));

        const result = await useCase.execute(validInput);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe("CREATE_ERROR");
    });

    it("should fail when passRepo.create fails", async () => {
        const createdUser = { id: USER_ID, email: validInput.email } as any;

        mockUserRepo.findByEmail
            .mockResolvedValueOnce(Result.fail(UserErrors.NOT_FOUND))
            .mockResolvedValueOnce(Result.ok(createdUser));
        mockRoleRepo.findByName.mockResolvedValue(Result.ok(defaultRole));
        mockPasswordProvider.hash.mockResolvedValue("HashedPass1!");
        mockUserRepo.create.mockResolvedValue(Result.ok(undefined as any));
        mockPassRepo.create.mockResolvedValue(Result.fail("PASS_ERROR"));

        const result = await useCase.execute(validInput);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe("PASS_ERROR");
    });

    it("should create user successfully", async () => {
        const createdUser = { id: USER_ID, email: validInput.email } as any;

        mockUserRepo.findByEmail
            .mockResolvedValueOnce(Result.fail(UserErrors.NOT_FOUND))
            .mockResolvedValueOnce(Result.ok(createdUser));
        mockRoleRepo.findByName.mockResolvedValue(Result.ok(defaultRole));
        mockPasswordProvider.hash.mockResolvedValue("HashedPass1!");
        mockUserRepo.create.mockResolvedValue(Result.ok(undefined as any));
        mockPassRepo.create.mockResolvedValue(Result.ok(undefined as any));

        const result = await useCase.execute(validInput);

        expect(result.isOk).toBe(true);
        expect(mockPasswordProvider.hash).toHaveBeenCalledWith(
            validInput.password,
        );
        expect(mockPassRepo.create).toHaveBeenCalledTimes(1);
    });
});
