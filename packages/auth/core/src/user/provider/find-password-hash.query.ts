import { Result } from "@pharmacore/shared";

export interface FindPasswordHashQuery {
  execute(userId: string): Promise<Result<{ hash: string }>>;
}
