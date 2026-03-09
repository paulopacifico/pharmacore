import { PermissionDTO } from "@pharmacore/auth";
import { ReactNode } from "react";
import { useAuth } from "../../data";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermissions: PermissionDTO[];
}
export function Can(props: PermissionGuardProps) {
  const { hasPermission } = useAuth();

  const canView = hasPermission(props.requiredPermissions);
  if (!canView) return null;

  return props.children;
}
