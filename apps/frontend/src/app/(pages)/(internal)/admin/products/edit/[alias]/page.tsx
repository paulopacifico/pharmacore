import { UpdateProductPage } from "@pharmacore/product-web";
export default async function EditPage({
    params,
}: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await params;

    return <UpdateProductPage productAlias={alias} />;
}
