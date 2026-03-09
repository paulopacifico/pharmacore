import { Id } from "./id.vo";

export class PermissionId extends Id {
    protected static override readonly INVALID_ID: string =
        "INVALID_PERMISSION_ID";
}
