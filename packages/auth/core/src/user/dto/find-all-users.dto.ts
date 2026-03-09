import { PaginatedInputDTO, PaginatedResultDTO } from "@pharmacore/shared";
import { UserDTO } from "./user.dto";

export type FindAllUsersInDTO = PaginatedInputDTO;

export type FindAllUsersOutDTO = PaginatedResultDTO<UserDTO>;
