import { CrudRepository } from "@pharmacore/shared";
import { Branch } from "../model/branch.entity";

export interface BranchRepository extends CrudRepository<Branch> {}
