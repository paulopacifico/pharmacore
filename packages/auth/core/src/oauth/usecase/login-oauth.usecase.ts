import { Result, UseCase } from "@pharmacore/shared";
import { RoleRepository } from "../../role";
import {
    FindUserByIdQuery,
    User,
    UserDTO,
    UserErrors,
    UserRepository,
} from "../../user";
import { OAuthErrors } from "../errors";
import { OAuthProvider, OAuthAccountRepository } from "../provider";

export interface LoginOAuthInDTO {
    code: string;
}

export interface LoginOAuthOutDTO extends UserDTO {}

export class LoginOAuthUseCase implements UseCase<
    LoginOAuthInDTO,
    LoginOAuthOutDTO
> {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly findUserByIdQuery: FindUserByIdQuery,
        private readonly roleRepo: RoleRepository,
        private readonly oauthRepo: OAuthAccountRepository,
        private readonly oauthProvider: OAuthProvider,
    ) {}

    async execute(input: LoginOAuthInDTO): Promise<Result<LoginOAuthOutDTO>> {
        if (!input.code) {
            return Result.fail(OAuthErrors.INVALID_CALLBACK_CODE);
        }

        const identityResult = await this.oauthProvider.getIdentityFromCode(
            input.code,
        );
        if (identityResult.isFailure) {
            return identityResult.withFail;
        }

        const identity = identityResult.instance;

        if (!identity.email) {
            return Result.fail(OAuthErrors.EMAIL_NOT_AVAILABLE);
        }

        if (!identity.emailVerified) {
            return Result.fail(OAuthErrors.EMAIL_NOT_VERIFIED);
        }

        const linkedAccountResult = await this.oauthRepo.findByProviderAccount({
            provider: identity.provider,
            providerUserId: identity.providerUserId,
        });

        if (linkedAccountResult.isOk) {
            const existingUser = await this.findUserByIdQuery.execute(
                linkedAccountResult.instance.userId,
            );
            if (existingUser.isFailure) {
                return existingUser.withFail;
            }

            return Result.ok(existingUser.instance);
        }

        if (
            linkedAccountResult.isFailure &&
            !linkedAccountResult.errors?.includes(OAuthErrors.ACCOUNT_NOT_FOUND)
        ) {
            return linkedAccountResult.withFail;
        }

        const userResult = await this.resolveOrCreateUser(
            identity.email,
            identity.name,
            identity.avatarUrl,
        );
        if (userResult.isFailure) {
            return userResult.withFail;
        }

        const user = userResult.instance;
        const linkResult = await this.oauthRepo.create({
            userId: user.id,
            provider: identity.provider,
            providerUserId: identity.providerUserId,
            email: identity.email,
            emailVerified: identity.emailVerified,
            name: identity.name,
            avatarUrl: identity.avatarUrl,
        });

        if (linkResult.isFailure) {
            return linkResult.withFail;
        }

        const userDto = await this.findUserByIdQuery.execute(user.id);
        if (userDto.isFailure) {
            return userDto.withFail;
        }

        return Result.ok(userDto.instance);
    }

    private async resolveOrCreateUser(
        email: string,
        name?: string,
        avatarUrl?: string,
    ): Promise<Result<User>> {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser.isOk) {
            return Result.ok(existingUser.instance);
        }

        if (
            existingUser.isFailure &&
            !existingUser.errors?.includes(UserErrors.NOT_FOUND)
        ) {
            return existingUser.withFail;
        }

        const roleResult = await this.roleRepo.findByName("colaborador");
        if (roleResult.isFailure) {
            return roleResult.withFail;
        }

        const userToCreate = User.tryCreate({
            email,
            name: name?.trim() || this.resolveNameFromEmail(email),
            avatarUrl,
            roleIds: [roleResult.instance.id],
        });

        if (userToCreate.isFailure) {
            return userToCreate.withFail;
        }

        const createResult = await this.userRepo.create(userToCreate.instance);
        if (createResult.isFailure) {
            return createResult.withFail;
        }

        const createdUser = await this.userRepo.findByEmail(email);
        if (createdUser.isFailure) {
            return createdUser.withFail;
        }

        return Result.ok(createdUser.instance);
    }

    private resolveNameFromEmail(email: string): string {
        const local = email.split("@")[0] ?? "Usuario";
        return local.replace(/[._-]+/g, " ").trim() || "Usuario";
    }
}
