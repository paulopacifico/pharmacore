"use client";

import {
  RoleRegistrationProvider,
  UserRegistrationProvider,
} from "@pharmacore/auth-web";
import { InternalShell } from "@/components/internal-shell";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <InternalShell>
      <RoleRegistrationProvider>
        <UserRegistrationProvider>
          {props.children}
        </UserRegistrationProvider>
      </RoleRegistrationProvider>
    </InternalShell>
  );
}
