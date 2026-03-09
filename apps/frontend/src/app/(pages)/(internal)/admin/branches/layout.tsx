"use client";

import { BranchProvider } from "@pharmacore/branch-web";
import { InternalShell } from "@/components/internal-shell";

export default function BranchLayout(props: { children: React.ReactNode }) {
    return (
        <InternalShell>
            <BranchProvider>{props.children}</BranchProvider>
        </InternalShell>
    );
}
