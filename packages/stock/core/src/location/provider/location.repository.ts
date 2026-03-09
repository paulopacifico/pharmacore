import { CrudRepository } from "@pharmacore/shared";
import { Location } from "../model/location.entity";

export interface LocationRepository extends CrudRepository<Location> {}
