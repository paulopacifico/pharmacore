import { UpdateBrandPage } from "@pharmacore/product-web";
export default async function EditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <UpdateBrandPage brandId={id} />;
}
