import {
    ChangePasswordUseCase,
    ChangePasswordIn,
    Password,
    PasswordRepository,
    PasswordStatus,
    User,
    UserRepository,
    Role,
    PasswordProvider,
    PasswordErrors,
    UserErrors,
} from "../../src";
import { Result, StrongPassword } from "@pharmacore/shared";

// Mock for PasswordProvider
const mockPasswordProvider: jest.Mocked<PasswordProvider> = {
    hash: jest.fn(),
    compare: jest.fn(),
};

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

const USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
const OLD_PLAIN_PASSWORD = "OldPassword123!";
const OLD_HASHED_PASSWORD = "OldPassword123!-hashed"; // Mock hashed version
const NEW_PLAIN_PASSWORD = "NewPassword123!";
const NEW_HASHED_PASSWORD = "NewPassword123!-hashed"; // Mock hashed version

const role = Role.create({
    name: "user",
    description: "user role",
    permissionIds: [],
});
const user = User.create({
    id: USER_ID,
    name: "Test User",
    email: "test@example.com",
    roleIds: [role.id],
});

describe("ChangePasswordUseCase", () => {
    let changePasswordUseCase: ChangePasswordUseCase;
    let oldPasswordEntity: Password;

    beforeEach(() => {
        jest.clearAllMocks();

        // Reset and setup default mocks for PasswordProvider
        mockPasswordProvider.hash.mockClear();
        mockPasswordProvider.compare.mockClear();
        mockPasswordProvider.hash.mockResolvedValue(NEW_HASHED_PASSWORD); // Default for new password
        mockPasswordProvider.compare.mockResolvedValue(true); // Default for comparison (old password)

        // Instantiate ChangePasswordUseCase with the mock PasswordProvider
        changePasswordUseCase = new ChangePasswordUseCase(
            mockUserRepo,
            mockPassRepo,
            mockPasswordProvider,
        );
        oldPasswordEntity = Password.create({
            content: OLD_HASHED_PASSWORD, // Entity now stores hashed password
            status: PasswordStatus.ACTIVE,
        });
    });

    it("should change password successfully", async () => {
        const input: ChangePasswordIn = {
            userId: USER_ID,
            oldPassword: OLD_PLAIN_PASSWORD,
            newPassword: NEW_PLAIN_PASSWORD,
            confirmPassword: NEW_PLAIN_PASSWORD,
        };

        const newPasswordEntity = Password.create({
            content: NEW_HASHED_PASSWORD, // Expect the hashed version
            status: PasswordStatus.ACTIVE,
        });

        mockUserRepo.findById.mockResolvedValue(Result.ok(user));
        mockPassRepo.findByUserId.mockResolvedValue(
            Result.ok(oldPasswordEntity),
        );
        mockPassRepo.update.mockImplementation(
            async (passwordToUpdate: Password) => {
                if (passwordToUpdate.status === PasswordStatus.INACTIVE) {
                    return Result.ok();
                }
                return Result.fail(
                    "Expected password to be INACTIVE for update",
                );
            },
        );
        mockPassRepo.create.mockResolvedValue(Result.ok(newPasswordEntity));

        const result = await changePasswordUseCase.execute(input);

        expect(result.isOk).toBe(true);
        expect(mockUserRepo.findById).toHaveBeenCalledWith(USER_ID);
        expect(mockPassRepo.findByUserId).toHaveBeenCalledWith(USER_ID);
        expect(mockPasswordProvider.compare).toHaveBeenCalledWith(
            OLD_PLAIN_PASSWORD,
            OLD_HASHED_PASSWORD,
        );
        expect(mockPasswordProvider.hash).toHaveBeenCalledWith(
            NEW_PLAIN_PASSWORD,
        );
        expect(oldPasswordEntity.status).toBe(PasswordStatus.ACTIVE);
        expect(mockPassRepo.update).toHaveBeenCalledWith(
            expect.objectContaining({
                content: OLD_HASHED_PASSWORD,
                status: PasswordStatus.INACTIVE,
            }),
        );
        expect(mockPassRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                content: NEW_HASHED_PASSWORD,
                status: PasswordStatus.ACTIVE,
            }),
            USER_ID,
        );
    });

    it("should fail if new passwords do not match", async () => {
        const input: ChangePasswordIn = {
            userId: USER_ID,
            oldPassword: OLD_PLAIN_PASSWORD,
            newPassword: NEW_PLAIN_PASSWORD,
            confirmPassword: "wrong-password",
        };

        const result = await changePasswordUseCase.execute(input);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe(PasswordErrors.MISMATCH);
        expect(mockPasswordProvider.compare).not.toHaveBeenCalled();
        expect(mockPasswordProvider.hash).not.toHaveBeenCalled();
    });

    it("should fail if user not found", async () => {
        const input: ChangePasswordIn = {
            userId: USER_ID,
            oldPassword: OLD_PLAIN_PASSWORD,
            newPassword: NEW_PLAIN_PASSWORD,
            confirmPassword: NEW_PLAIN_PASSWORD,
        };

        mockUserRepo.findById.mockResolvedValue(
            Result.fail(UserErrors.NOT_FOUND),
        );

        const result = await changePasswordUseCase.execute(input);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe(UserErrors.NOT_FOUND);
        expect(mockPasswordProvider.compare).not.toHaveBeenCalled();
        expect(mockPasswordProvider.hash).not.toHaveBeenCalled();
    });

    it("should fail if old password does not match", async () => {
        const input: ChangePasswordIn = {
            userId: USER_ID,
            oldPassword: "wrong-old-password",
            newPassword: NEW_PLAIN_PASSWORD,
            confirmPassword: NEW_PLAIN_PASSWORD,
        };

        mockUserRepo.findById.mockResolvedValue(Result.ok(user));
        mockPassRepo.findByUserId.mockResolvedValue(
            Result.ok(oldPasswordEntity),
        );
        mockPasswordProvider.compare.mockResolvedValue(false);

        const result = await changePasswordUseCase.execute(input);

        expect(result.isFailure).toBe(true);
        expect(result.errors?.[0]).toBe(PasswordErrors.MISMATCH);
        expect(mockPasswordProvider.compare).toHaveBeenCalledWith(
            "wrong-old-password",
            OLD_HASHED_PASSWORD,
        );
        expect(mockPasswordProvider.hash).not.toHaveBeenCalled();
    });

    it("should fail if new password is not strong", async () => {
        const input: ChangePasswordIn = {
            userId: USER_ID,
            oldPassword: OLD_PLAIN_PASSWORD,
            newPassword: "weak",
            confirmPassword: "weak",
        };

        mockUserRepo.findById.mockResolvedValue(Result.ok(user));
        mockPassRepo.findByUserId.mockResolvedValue(
            Result.ok(oldPasswordEntity),
        );
        mockPasswordProvider.compare.mockResolvedValue(true);

        jest.spyOn(StrongPassword, "tryCreate").mockReturnValue(
            Result.fail("WEAK_PASSWORD"),
        );

        const result = await changePasswordUseCase.execute(input);

        expect(result.isFailure).toBe(true);
        expect(result.errors).toBeDefined();
        expect(mockPasswordProvider.hash).not.toHaveBeenCalled();
    });
});
