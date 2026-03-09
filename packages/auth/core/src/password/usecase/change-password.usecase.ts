import { Result, StrongPassword, UseCase } from "@pharmacore/shared";
import { PasswordRepository, PasswordProvider } from "../provider";
import { PasswordErrors } from "../errors";
import { Password, PasswordStatus } from "../model";
import { UserRepository } from "../../user";

export interface ChangePasswordIn {
	userId: string;
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export class ChangePasswordUseCase implements UseCase<ChangePasswordIn, void> {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly passRepo: PasswordRepository,
		private readonly passwordProvider: PasswordProvider,
	) {}

	async execute(input: ChangePasswordIn): Promise<Result<void>> {
		if (input.newPassword !== input.confirmPassword) {
			return Result.fail(PasswordErrors.MISMATCH);
		}

		const userResult = await this.userRepo.findById(input.userId);
		if (userResult.isFailure) {
			return userResult.withFail;
		}

		const oldPassResult = await this.passRepo.findByUserId(input.userId);
		if (oldPassResult.isFailure) {
			return oldPassResult.withFail;
		}

		const oldPass = oldPassResult.instance;

		const isSamePass = await this.passwordProvider.compare(
			input.oldPassword,
			oldPass.content,
		);

		if (!isSamePass) {
			return Result.fail(PasswordErrors.MISMATCH);
		}

		const deactivatedPassResult = oldPass.deactivate();
		if (deactivatedPassResult.isFailure) {
			return deactivatedPassResult.withFail;
		}
		const deactivatedPass = deactivatedPassResult.instance;

		const updateResult = await this.passRepo.update(deactivatedPass);
		if (updateResult.isFailure) {
			return updateResult.withFail;
		}

		const strongPasswordResult = StrongPassword.tryCreate(input.newPassword);
		if (strongPasswordResult.isFailure) {
			return strongPasswordResult.withFail;
		}

		const hashedPassword = await this.passwordProvider.hash(input.newPassword);

		const newPassResult = Password.tryCreate({
			content: hashedPassword,
			status: PasswordStatus.ACTIVE,
		});

		if (newPassResult.isFailure) {
			return newPassResult.withFail;
		}

		const newPass = newPassResult.instance;

		const createResult = await this.passRepo.create(newPass, input.userId);
		if (createResult.isFailure) {
			return createResult.withFail;
		}

		return Result.ok();
	}
}
