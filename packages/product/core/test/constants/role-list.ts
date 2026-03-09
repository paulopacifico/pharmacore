import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  READ_PRODUCT,
  UPDATE_PRODUCT,
} from "./permission-list";
import { Role } from "@pharmacore/auth";
export const USER = Role.tryCreate({
  name: "USER",
  description: "Standard user role with limited permissions",
  permissions: [READ_PRODUCT],
}).instance;

export const ADMIN = Role.tryCreate({
  name: "ADMIN",
  description: "Administrator role with full permissions",
  permissions: [READ_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT],
}).instance;

export const STAFF = Role.tryCreate({
  name: "STAFF",
  description: "Staff role with create and read permissions",
  permissions: [READ_PRODUCT, CREATE_PRODUCT],
}).instance;
