"use client";

import { useEffect, useState } from "react";
import {
    Breadcrumb,
    KPICard,
    Loading,
    PageHeader,
} from "@pharmacore/shared-web";
import { useStats } from "../../data";
import {
    ShoppingBagIcon,
    Squares2X2Icon,
    TagIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    ClockIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { formatRelativeDate, truncateText } from "../../utils";

const CHART_COLORS = [
    "#6366F1",
    "#3B82F6",
    "#22d3ee",
    "#f59e0b",
    "#5d5d92",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
];

export function Dashboard() {
    const { stats } = useStats();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    useEffect(() => {
        if (
            !selectedCategoryId &&
            stats?.categories?.length &&
            stats.categories.length > 0
        ) {
            setSelectedCategoryId((stats?.categories[0] as any).id);
        }
    }, [stats?.categories, selectedCategoryId]);

    if (!stats) {
        return <Loading />;
    }

    // Build bar chart from real categories with subcategory count
    const categoryChartData = (stats.categories ?? [])
        .map((cat: any) => ({
            label: truncateText(cat.name, 12),
            fullName: cat.name,
            value: cat.subcategories?.length ?? 0,
        }))
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, 8);

    const maxCatValue = Math.max(
        ...categoryChartData.map((c: any) => c.value),
        1,
    );

    const selectedCategory = stats.categories?.find(
        (c: any) => c.id === selectedCategoryId,
    ) as any;
    const subcategories = selectedCategory?.subcategories ?? [];
    const totalSubcats = subcategories.length;
    const donutData = subcategories.slice(0, 5).map((sub: any, i: number) => ({
        label: truncateText(sub.name, 12),
        percent: totalSubcats > 0 ? Math.round((1 / totalSubcats) * 100) : 0,
        color: CHART_COLORS[i % CHART_COLORS.length],
    }));

    // Adjust last percent to fill 100%
    if (donutData.length > 0) {
        const sumPercent = donutData.reduce(
            (s: number, d: any) => s + d.percent,
            0,
        );
        donutData[donutData.length - 1].percent += 100 - sumPercent;
    }

    const kpis = [
        {
            label: "Total de Produtos",
            value: stats.kpi.totalProducts ?? "--",
            icon: <ShoppingBagIcon className="size-5" />,
            bgColor: "#6FCFBE",
            textColor: "#1A6156",
            badgeBgColor: "#1A615633",
            trend: {
                value: stats.kpi.totalProducts
                    ? `${stats.kpi.totalProducts} cadastrados`
                    : "Sem dados",
                positive: true,
            },
        },
        {
            label: "Total de Categorias",
            value: stats.kpi.totalCategories ?? "--",
            icon: <Squares2X2Icon className="size-5" />,
            bgColor: "#6F98E6",
            textColor: "#25508F",
            badgeBgColor: "#25508F33",
            trend: {
                value: stats.kpi.totalCategories
                    ? `${stats.kpi.totalCategories} ativas`
                    : "Sem dados",
                positive: true,
            },
        },
        {
            label: "Total de Subcategorias",
            value: stats.kpi.totalSubcategories ?? "--",
            icon: <TagIcon className="size-5" />,
            bgColor: "#E6C983",
            textColor: "#7A5C19",
            badgeBgColor: "#7A5C1933",
            trend: {
                value: stats.kpi.totalSubcategories
                    ? `${stats.kpi.totalSubcategories} ativas`
                    : "Sem dados",
                positive: true,
            },
        },
        {
            label: "Total de Marcas",
            value: stats.kpi.totalBrands ?? "0",
            icon: <FunnelIcon className="size-5" />,
            bgColor: "#E5966B",
            textColor: "#7D4325",
            badgeBgColor: "#7D432533",
            trend: {
                value: stats.kpi.totalBrands
                    ? `${stats.kpi.totalBrands} marcas`
                    : "Sem dados",
                positive: true,
            },
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Dashboard de Produtos"
                subtitle="Visão geral de métricas, tendências e atividade do catálogo."
                breadcrumb={
                    <Breadcrumb
                        items={[
                            {
                                name: "Inicio",
                                href: "/dashboard",
                                current: false,
                            },
                            {
                                name: "Produtos",
                                href: "/admin/products",
                                current: false,
                            },
                            {
                                name: "Dashboard",
                                href: "/admin/products",
                                current: true,
                            },
                        ]}
                    />
                }
                actions={
                    <button className="flex items-center gap-2 rounded-lg border border-border-card bg-bg-card px-4 py-2.5 text-[13px] font-medium text-text-secondary">
                        <ArrowDownTrayIcon className="size-4" />
                        Exportar
                    </button>
                }
            />

            {/* KPI Row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                    <KPICard
                        key={kpi.label}
                        icon={kpi.icon}
                        value={kpi.value}
                        label={kpi.label}
                        bgColor={kpi.bgColor}
                        textColor={kpi.textColor}
                        badgeBgColor={kpi.badgeBgColor}
                        trend={kpi.trend}
                    />
                ))}
            </div>

            {/* Charts Row */}
            <div className="flex flex-col gap-4 xl:flex-row">
                {/* Bar Chart - Produtos por Categoria (real data: subcategory count per category) */}
                <div className="flex min-h-[360px] flex-1 flex-col rounded-[14px] border border-border-card bg-bg-card p-4 sm:h-[420px] sm:p-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Subcategorias por Categoria
                        </h3>
                        <span className="rounded-full bg-[#3B82F626] px-3 py-1 text-[11px] font-semibold text-[#60A5FA]">
                            {stats?.categories?.length ?? 0} categorias
                        </span>
                    </div>
                    {categoryChartData.length > 0 ? (
                        <div className="flex-1 overflow-x-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
                            <div className="flex h-full min-w-[560px] items-end gap-3.5 px-2 pb-7">
                                {categoryChartData.map((bar: any) => (
                                    <div
                                        key={bar.fullName}
                                        className="flex min-w-[52px] flex-1 flex-col items-center gap-2"
                                    >
                                        <span className="text-[11px] font-bold text-text-secondary font-heading">
                                            {bar.value}
                                        </span>
                                        <div
                                            className="w-full rounded-t-[6px]"
                                            style={{
                                                height: Math.max(
                                                    (bar.value / maxCatValue) *
                                                        220,
                                                    8,
                                                ),
                                                background:
                                                    "linear-gradient(to top, #6366F1, #3B82F6)",
                                            }}
                                        />
                                        <span className="w-full truncate text-center text-[10px] font-medium text-text-muted">
                                            {bar.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-text-muted text-sm">
                            Sem categorias
                        </div>
                    )}
                </div>

                {/* Donut - Subcategorias da principal categoria */}
                <div className="flex min-h-[360px] w-full flex-col rounded-[14px] border border-border-card bg-bg-card p-4 sm:h-[420px] sm:p-6 xl:w-[420px] xl:shrink-0">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Subcategorias
                        </h3>
                        <span className="rounded-full bg-[#6366F126] px-3 py-1 text-[11px] font-semibold text-[#A5B4FC]">
                            por categoria
                        </span>
                    </div>

                    {/* Filter row */}
                    <div className="mb-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                        <span className="text-xs font-medium text-text-muted">
                            Categoria:
                        </span>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) =>
                                setSelectedCategoryId(e.target.value)
                            }
                            className="w-full appearance-none rounded-lg border border-border-input bg-bg-input px-3 py-2 text-xs font-medium text-text-secondary sm:flex-1"
                        >
                            {stats?.categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Donut + Legend */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row">
                        {donutData.length > 0 ? (
                            <>
                                <div className="relative size-40 shrink-0">
                                    <svg
                                        viewBox="0 0 160 160"
                                        className="size-full -rotate-90"
                                    >
                                        {donutData.map(
                                            (seg: any, i: number) => {
                                                const circumference =
                                                    2 * Math.PI * 55;
                                                const cumulativePercent =
                                                    donutData
                                                        .slice(0, i)
                                                        .reduce(
                                                            (
                                                                s: number,
                                                                d: any,
                                                            ) => s + d.percent,
                                                            0,
                                                        );
                                                const offset =
                                                    (cumulativePercent / 100) *
                                                    circumference;
                                                const segLength =
                                                    (seg.percent / 100) *
                                                    circumference;
                                                return (
                                                    <circle
                                                        key={seg.label}
                                                        cx="80"
                                                        cy="80"
                                                        r="55"
                                                        fill="none"
                                                        stroke={seg.color}
                                                        strokeWidth="25"
                                                        strokeDasharray={`${segLength} ${circumference - segLength}`}
                                                        strokeDashoffset={
                                                            -offset
                                                        }
                                                    />
                                                );
                                            },
                                        )}
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[22px] font-bold text-text-primary font-heading">
                                            {totalSubcats}
                                        </span>
                                        <span className="text-[11px] font-medium text-text-muted">
                                            subcategorias
                                        </span>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col gap-3 sm:w-auto">
                                    {donutData.map((item: any) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-2"
                                        >
                                            <div
                                                className="size-2.5 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="min-w-0 flex-1 truncate text-xs font-medium text-text-secondary">
                                                {item.label}
                                            </span>
                                            <span className="shrink-0 text-xs font-bold text-text-primary">
                                                {item.percent}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center flex-1 text-text-muted text-sm">
                                Sem subcategorias
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Row */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Produtos recentes */}
                <div className="rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Produtos recentes
                        </h3>
                        <span className="text-right text-[11px] font-medium text-accent-cyan">
                            {stats.lastCreatedProducts.length} atualizações
                            recentes
                        </span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {stats.lastCreatedProducts.length > 0 ? (
                            stats.lastCreatedProducts.map((item) => (
                                <div
                                    key={item.sku}
                                    className="flex items-start gap-2.5 rounded-[10px] border border-border-input bg-bg-input px-3 py-2.5 sm:items-center"
                                >
                                    <ClockIcon className="size-4 text-text-muted shrink-0" />
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-[13px] font-medium text-text-primary truncate">
                                            {item.name}
                                        </span>
                                        <span className="text-[11px] text-text-muted">
                                            Atualizado{" "}
                                            {formatRelativeDate(item.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-6 text-text-muted text-sm">
                                Nenhum produto encontrado
                            </div>
                        )}
                    </div>
                </div>

                {/* Exclusões recentes (placeholder — API doesn't expose soft-deleted items) */}
                <div className="rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Exclusões recentes
                        </h3>
                        <span className="text-right text-[11px] font-medium text-status-error">
                            {stats.lastDeletedProducts.length} exclusões
                            recentes
                        </span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {stats.lastDeletedProducts.length > 0 ? (
                            stats.lastDeletedProducts.map((item) => (
                                <div
                                    key={item.sku}
                                    className="flex items-start gap-2.5 rounded-[10px] border border-border-input bg-bg-input px-3 py-2.5 sm:items-center"
                                >
                                    <ClockIcon className="size-4 text-text-muted shrink-0" />
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="text-[13px] font-medium text-text-primary truncate">
                                            {item.name}
                                        </span>
                                        <span className="text-[11px] text-text-muted">
                                            Excluído{" "}
                                            {formatRelativeDate(item.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-start gap-2.5 rounded-[10px] border border-border-input bg-bg-input px-3 py-2.5 sm:items-center">
                                <TrashIcon className="size-4 shrink-0 text-status-error" />
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="break-words text-[13px] font-medium text-text-muted">
                                        Nenhuma exclusão recente registrada
                                    </span>
                                    <span className="text-[11px] text-text-muted">
                                        Exclusões aparecerão aqui quando
                                        disponíveis
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
