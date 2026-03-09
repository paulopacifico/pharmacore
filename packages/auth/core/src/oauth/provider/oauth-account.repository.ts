import { Result } from "@pharmacore/shared";
import { CreateOAuthAccountInDTO, FindOAuthAccountInDTO, OAuthAccountDTO } from "../dto";

export interface OAuthAccountRepository {
  findByProviderAccount(data: FindOAuthAccountInDTO): Promise<Result<OAuthAccountDTO>>;
  create(data: CreateOAuthAccountInDTO): Promise<Result<void>>;
}
