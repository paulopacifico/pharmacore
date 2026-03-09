import {
  Entity,
  EntityProps,
  Result,
  StrongPassword,
} from "@pharmacore/shared";
import { PasswordStatus } from "./password-status.enum";

interface PasswordProps extends EntityProps {
  content: string;
  status: PasswordStatus;
}

export class Password extends Entity<Password, PasswordProps> {
  protected constructor(props: PasswordProps) {
    super(props);
  }

  get content(): string {
    return this.props.content;
  }
  get status(): PasswordStatus {
    return this.props.status;
  }

  deactivate(): Result<Password> {
    return this.cloneWith({ status: PasswordStatus.INACTIVE });
  }

  static create(props: PasswordProps): Password {
    const result = Password.tryCreate(props);
    result.throwIfFailed();
    return result.instance;
  }

  static tryCreate(props: PasswordProps): Result<Password> {
    const strongPassword = StrongPassword.tryCreate(props.content);

    const attributes = Result.combine([strongPassword]);

    if (attributes.isFailure) {
      return Result.fail(attributes.errors!);
    }

    return Result.ok(new Password({ ...props, content: props.content }));
  }
}
