"use client";

import { PrivateRoute } from "@pharmacore/auth-web";
import { InternalPage } from "./template/internal-page.component";

interface InternalShellProps {
  children: React.ReactNode;
}

export function InternalShell({ children }: InternalShellProps) {
  return (
    <PrivateRoute>
      <InternalPage>
        {children}
      </InternalPage>
    </PrivateRoute>
  );
}
