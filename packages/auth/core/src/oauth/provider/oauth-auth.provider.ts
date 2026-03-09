import { Result } from "@pharmacore/shared";
import { OAuthIdentityDTO } from "../dto";

export interface OAuthProvider {
    getAuthorizationUrl(state: string): Result<string>;
    getIdentityFromCode(code: string): Promise<Result<OAuthIdentityDTO>>;
}
