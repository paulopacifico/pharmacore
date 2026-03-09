import { PaginatedInputDTO, PaginatedResultDTO } from "@pharmacore/shared";
import { BranchListItem } from "./branch-list.dto";

export type FindManyBranchesIn = PaginatedInputDTO & { name?: string };

export type FindManyBranchesOut = PaginatedResultDTO<BranchListItem>;
