import { BranchDetailsPage } from "@pharmacore/branch-web";

export default async function DetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <BranchDetailsPage branchId={id} />;
}
