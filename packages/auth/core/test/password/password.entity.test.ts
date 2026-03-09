import { Password } from "../../src/password/model/password.entity";
import { PasswordStatus } from "../../src/password/model/password-status.enum";

test("Deve ter erro pra senha inválida", () => {
  const senha = "123";
  const password = Password.tryCreate({
    content: senha,
    status: PasswordStatus.ACTIVE,
  });
  expect(password.isFailure).toBe(true);
});

test("Deve dar certo pra senha válida", () => {
  const senha = "StrongPassword123!";
  const password = Password.create({
    content: senha,
    status: PasswordStatus.ACTIVE,
  });
  expect(password.content).toBeDefined();
});
