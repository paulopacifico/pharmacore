import { PaginatedInputDTO, PaginatedResultDTO } from "@pharmacore/shared";
import { RoleDTO } from "./role.dto";

export type FindAllRolesInDTO = PaginatedInputDTO & { all?: boolean };

export type FindAllRolesOutDTO = PaginatedResultDTO<RoleDTO>;
