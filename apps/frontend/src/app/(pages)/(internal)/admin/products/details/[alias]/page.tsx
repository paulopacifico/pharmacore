import { ProductDetailsPage } from "@pharmacore/product-web";
import {
    PlusIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

const stockButtons = [
    { color: "#6366F1", text: "Adicionar ao estoque", Icon: PlusIcon },
    { color: "#3B82F6", text: "Ver estoque atual", Icon: EyeIcon },
    {
        color: "#22d3ee",
        text: "Ajustar quantidade",
        Icon: PencilSquareIcon,
    },
    { color: "#f59e0b", text: "Remover do estoque", Icon: TrashIcon },
    { color: "#5d5d92", text: "Histórico de estoque", Icon: ClockIcon },
];

const StockButtonsList = () => (
    <div className="flex gap-2 mb-4">
        {stockButtons.map((btn, idx) => {
            const Icon = btn.Icon || PlusIcon;
            return (
                <button
                    key={idx}
                    type="button"
                    className="text-white px-5 py-3 rounded shadow-sm flex items-center filter brightness-80 hover:brightness-100 transition-all"
                    style={{
                        background: btn.color,
                    }}
                >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-semibold">{btn.text}</span>
                </button>
            );
        })}
    </div>
);

export default async function ProductDetails({
    params,
}: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await params;

    return (
        <ProductDetailsPage
            productAlias={alias}
            // actions={<StockButtonsList />}
        />
    );
}
