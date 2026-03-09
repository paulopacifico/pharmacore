"use client";

import { InternalShell } from "@/components/internal-shell";

export default function InternalMainLayout(props: {
  children: React.ReactNode;
}) {
  return <InternalShell>{props.children}</InternalShell>;
}
