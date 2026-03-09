import { BranchProps } from "../model/branch.entity";

export interface BranchListItem extends BranchProps {}

export interface BranchListDTO extends Array<BranchListItem> {}
