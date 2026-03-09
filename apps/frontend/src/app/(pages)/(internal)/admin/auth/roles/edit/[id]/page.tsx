import { EditRolePage } from "@pharmacore/auth-web";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditRolePage roleId={id} />;
}
