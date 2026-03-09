import { EditUserPage as AuthEditUserPage } from "@pharmacore/auth-web";

export default async function UserEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <AuthEditUserPage userId={id} />;
}
