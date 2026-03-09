import { Result, UseCase } from "@pharmacore/shared";
import { User, UserErrors, UserRepository } from "../user";
import {
    Password,
    PasswordProvider,
    PasswordRepository,
    PasswordStatus,
} from "../password";
import { RoleRepository } from "../role";

export interface CreateUserIn {
    name: string;
    email: string;
    password: string;
}

export class CreateUserUseCase implements UseCase<CreateUserIn, void> {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly passRepo: PasswordRepository,
        private readonly roleRepo: RoleRepository,
        private readonly passwordProvider: PasswordProvider,
    ) {}

    async execute(data: CreateUserIn): Promise<Result<void>> {
        const hasUser = await this.userRepo.findByEmail(data.email);
        if (hasUser.isOk) {
            return Result.fail(UserErrors.EMAIL_ALREADY_EXISTS);
        }
        if (
            hasUser.isFailure &&
            !hasUser.errors?.includes(UserErrors.NOT_FOUND)
        ) {
            return hasUser.withFail;
        }

        const hasRole = await this.roleRepo.findByName("colaborador");

        if (hasRole.isFailure) {
            return hasRole.withFail;
        }

        const hashedPassword = await this.passwordProvider.hash(data.password);

        const passResult = Password.tryCreate({
            content: hashedPassword,
            status: PasswordStatus.ACTIVE,
        });

        if (passResult.isFailure) {
            return passResult.withFail;
        }

        const userResult = User.tryCreate({
            name: data.name,
            email: data.email,
            roleIds: [hasRole.instance.id],
        });

        if (userResult.isFailure) {
            return userResult.withFail;
        }

        const user = userResult.instance;

        const userCreatedResult = await this.userRepo.create(user);
        if (userCreatedResult.isFailure) {
            return userCreatedResult.withFail;
        }

        const userData = await this.userRepo.findByEmail(data.email);

        const newPass = passResult.instance;
        const passSaveResult = await this.passRepo.create(
            newPass,
            userData.instance.id,
        );
        if (passSaveResult.isFailure) {
            return passSaveResult.withFail;
        }

        return Result.ok();
    }
}
