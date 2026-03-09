"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    PageHeader,
    Breadcrumb,
    KPICard,
    Loading,
} from "@pharmacore/shared-web";
import { useAuthOverview } from "@pharmacore/auth-web";
import { useStats } from "@pharmacore/product-web";
import { useBranchList } from "@pharmacore/branch-web";
import {
    CubeIcon,
    Squares2X2Icon,
    TagIcon,
    EyeIcon,
    PlusIcon,
    UserPlusIcon,
    BuildingStorefrontIcon,
    ArchiveBoxIcon,
    ShoppingCartIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

interface DashboardData {
    totalProducts: number;
    totalCategories: number;
    totalSubcategories: number;
    totalUsers: number;
    categories: { name: string; subcategoriesCount: number }[];
}

const quickActions = [
    {
        label: "Novo Produto",
        icon: <PlusIcon className="size-3.5" />,
        color: "#7B93B7",
        href: "/admin/products/list",
    },
    {
        label: "Criar Usuário",
        icon: <UserPlusIcon className="size-3.5" />,
        color: "#8B90A3",
        href: "/admin/auth/users",
    },
    {
        label: "Gerenciar Filiais",
        icon: <BuildingStorefrontIcon className="size-3.5" />,
        color: "#6B8F97",
        href: "/admin/branches",
    },
    {
        label: "Entrada de Estoque",
        icon: <ArchiveBoxIcon className="size-3.5" />,
        color: "#6E9A80",
        href: "#",
    },
    {
        label: "Nova Venda",
        icon: <ShoppingCartIcon className="size-3.5" />,
        color: "#B69266",
        href: "#",
    },
];

const RANK_COLORS = ["#2563EB", "#7C3AED", "#06B6D4", "#0EA5E9", "#3B82F6"];

export default function DashboardPage() {
    const { overview: authOverview, isLoading: authLoading } =
        useAuthOverview();
    const { branches: appBranches, isLoading: branchesLoading } = useBranchList();
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { stats, isLoading: statsLoading } = useStats();

    useEffect(() => {
        async function loadDashboard() {
            try {
                const { kpi, categories } = stats!;

                setData({
                    totalProducts: kpi.totalProducts,
                    totalCategories: kpi.totalCategories,
                    totalSubcategories: kpi.totalSubcategories,
                    totalUsers: 0,
                    categories: categories
                        .map((c: any) => ({
                            name: c.name,
                            subcategoriesCount: c.subcategories?.length ?? 0,
                        }))
                        .sort(
                            (a: any, b: any) =>
                                b.subcategoriesCount - a.subcategoriesCount,
                        ),
                });
            } catch (err) {
                console.error("Failed to load dashboard:", err);
            } finally {
                setIsLoading(false);
            }
        }

        if (stats) {
            loadDashboard();
        }
    }, [stats]);

    if (isLoading || authLoading || statsLoading || branchesLoading) {
        return <Loading />;
    }

    const totalUsers = authOverview?.login?.activeUsers?.total ?? 0;
    const allBranches = appBranches;
    const totalBranches = allBranches.length;

    const kpiCards = [
        {
            label: "Produtos Ativos",
            value: data?.totalProducts?.toLocaleString("pt-BR") ?? "--",
            bgColor: "#6fcfbe",
            textColor: "#1A6156",
            badgeBgColor: "#1A615633",
            trend: {
                value: `${data?.totalProducts ?? 0} cadastrados`,
                positive: true,
            },
            icon: <CubeIcon className="size-5" />,
        },
        {
            label: "Categorias",
            value: String(data?.totalCategories ?? "--"),
            bgColor: "#6F98E6",
            textColor: "#25508F",
            badgeBgColor: "#25508F33",
            trend: {
                value: `${data?.totalCategories ?? 0} ativas`,
                positive: true,
            },
            icon: <Squares2X2Icon className="size-5" />,
        },
        {
            label: "Subcategorias",
            value: String(data?.totalSubcategories ?? "--"),
            bgColor: "#E6C983",
            textColor: "#7A5C19",
            badgeBgColor: "#7A5C1933",
            trend: {
                value: `${data?.totalSubcategories ?? 0} ativas`,
                positive: true,
            },
            icon: <TagIcon className="size-5" />,
        },
        {
            label: "Usuários Ativos",
            value: String(totalUsers || "--"),
            bgColor: "#E5966B",
            textColor: "#7D4325",
            badgeBgColor: "#7D432533",
            trend: {
                value:
                    totalUsers > 0 ? `${totalUsers} no período` : "Sem dados",
                positive: true,
            },
            icon: <EyeIcon className="size-5" />,
        },
    ];

    const weekdayData =
        authOverview?.securityAccess?.avgAuthLatencyByWeekday ?? [];
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const barData =
        weekdayData.length > 0
            ? weekdayData.map((d: any) => ({
                label: weekdays[d.weekday] ?? `D${d.weekday}`,
                height: d.avgDurationMs,
            }))
            : weekdays.slice(1).map((label) => ({ label, height: 0 }));

    const maxBarHeight = Math.max(...barData.map((b: any) => b.height), 1);
    const barFills = [
        "linear-gradient(to bottom, #38BDF8, #3B82F6)",
        "#3B82F6",
        "#60A5FA",
        "#4F46E5",
        "#2563EB",
        "#38BDF8",
        "#60A5FACC",
    ];

    const activeCount = allBranches.filter((b) => b.isActive).length;

    const rankData = (data?.categories ?? []).slice(0, 5);
    const maxRank = Math.max(...rankData.map((c) => c.subcategoriesCount), 1);

    const authRanking =
        authOverview?.administrativeActivity?.authActivityRanking ?? [];
    const activities = authRanking.slice(0, 4).map((item: any) => ({
        title: `${item.actions} ações por ${item.user}`,
        time: formatRelativeDate(new Date(item.lastActionAt)),
        iconColor: "#06B6D4",
        iconBg: "#06B6D433",
        icon: <UserIcon className="size-4" />,
    }));

    const authAlerts = authOverview?.securityAccess?.alertBoard ?? [];
    const alerts = authAlerts.slice(0, 3).map((alert: any) => ({
        title: alert.event,
        desc: alert.detail,
        iconColor: alert.severity === "CRITICAL" ? "#7C3AED" : "#2563EB",
        iconBg: alert.severity === "CRITICAL" ? "#7C3AED33" : "#2563EB33",
        icon: <ExclamationTriangleIcon className="size-4" />,
    }));

    if (alerts.length === 0) {
        alerts.push({
            title: "Módulo de Vendas",
            desc: "Em implantação — dados parciais",
            iconColor: "#06B6D4",
            iconBg: "#06B6D433",
            icon: <InformationCircleIcon className="size-4" />,
        });
    }

    return (
        <div className="flex flex-col gap-7">
            <PageHeader
                title="Dashboard"
                subtitle={`Última atualização: ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`}
                breadcrumb={
                    <Breadcrumb
                        items={[
                            {
                                name: "Inicio",
                                href: "/dashboard",
                                current: false,
                            },
                            {
                                name: "Dashboard",
                                href: "/dashboard",
                                current: true,
                            },
                        ]}
                    />
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {kpiCards.map((kpi) => (
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

            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[13px] font-medium text-text-muted">
                    Acesso rápido
                </span>
                <div className="h-5 w-px bg-border-card" />
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-2 rounded-lg border border-border-card bg-bg-card px-3.5 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-bg-card-hover"
                    >
                        <span style={{ color: action.color }}>
                            {action.icon}
                        </span>
                        {action.label}
                    </Link>
                ))}
            </div>

            <div className="flex flex-col gap-5 lg:h-[320px] lg:flex-row">
                <div className="flex min-h-[280px] flex-1 flex-col rounded-[14px] border border-border-card bg-bg-card p-4 sm:min-h-[320px] sm:p-6">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Tendência de Atividade
                        </h3>
                        <span className="rounded-full bg-[#3B82F626] px-3 py-1 text-[11px] font-medium text-[#93C5FD]">
                            Últimos 7 dias
                        </span>
                    </div>
                    <div className="flex h-[180px] min-h-[180px] items-end gap-2 px-1 pb-5 sm:h-[220px] sm:gap-3 sm:px-2 sm:pb-6 lg:h-auto lg:min-h-0 lg:flex-1">
                        {barData.map((bar: any, i: number) => (
                            <div
                                key={bar.label}
                                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5 sm:gap-2"
                            >
                                <div
                                    className="w-full rounded-t-[6px]"
                                    style={{
                                        height: `${Math.max((bar.height / maxBarHeight) * 80, 3)}%`,
                                        background:
                                            barFills[i % barFills.length],
                                    }}
                                />
                                <span className="shrink-0 text-[11px] leading-none text-text-muted">
                                    {bar.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex w-full flex-col overflow-hidden rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-6 lg:w-[380px] lg:shrink-0">
                    <div className="flex items-center justify-between mb-1.5 shrink-0">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Filiais da Rede
                        </h3>
                        <span className="rounded-full bg-[#6366F126] px-3 py-1 text-[11px] font-medium text-[#A5B4FC]">
                            {activeCount}/{totalBranches} ativas
                        </span>
                    </div>
                    <p className="mb-3 shrink-0 text-[11px] text-text-muted">
                        Unidades cadastradas e localização
                    </p>
                    <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
                        {allBranches.length > 0 ? (
                            allBranches.map((branch, i) => (
                                <div
                                    key={`${branch.name}-${i}`}
                                    className="flex items-center gap-3 py-2 shrink-0"
                                    style={
                                        i < allBranches.length - 1
                                            ? {
                                                borderBottom:
                                                    "1px solid var(--color-border-card)",
                                            }
                                            : undefined
                                    }
                                >
                                    <div
                                        className="size-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: branch.isActive
                                                ? "#06B6D4"
                                                : "#64748b",
                                        }}
                                    />
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <span className="truncate text-[13px] font-medium text-text-primary">
                                            {branch.name}
                                        </span>
                                        <span className="truncate text-[11px] text-text-muted">
                                            {branch.address?.city && branch.address?.state
                                                ? `${branch.address.city}/${branch.address.state}`
                                                : "Endereço não informado"}
                                        </span>
                                    </div>
                                    <span
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: branch.isActive
                                                ? "#06B6D433"
                                                : "#64748b33",
                                            color: branch.isActive
                                                ? "#06B6D4"
                                                : "#94A3B8",
                                        }}
                                    >
                                        {branch.isActive ? "Ativa" : "Inativa"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
                                Nenhuma filial cadastrada
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="flex min-h-[260px] flex-col rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-6 lg:h-[340px]">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Categorias Mais Relevantes
                        </h3>
                        <span className="text-xs font-medium text-text-secondary">
                            Ver todas
                        </span>
                    </div>
                    <div className="flex flex-col gap-4 flex-1">
                        {rankData.length > 0 ? (
                            rankData.map((item, i) => (
                                <div
                                    key={item.name}
                                    className="flex flex-col gap-1.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] font-medium text-text-primary">
                                            {item.name}
                                        </span>
                                        <span className="text-xs text-text-muted">
                                            {item.subcategoriesCount}{" "}
                                            subcategorias
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-[3px] bg-border-card">
                                        <div
                                            className="h-full rounded-[3px]"
                                            style={{
                                                width: `${(item.subcategoriesCount / maxRank) * 100}%`,
                                                backgroundColor:
                                                    RANK_COLORS[
                                                    i % RANK_COLORS.length
                                                    ],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
                                Sem categorias
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex min-h-[260px] flex-col rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-6 lg:h-[340px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Alertas Operacionais
                        </h3>
                        <div className="flex size-6 items-center justify-center rounded-full bg-accent-purple/20">
                            <span className="text-[11px] font-semibold text-accent-purple">
                                {alerts.length}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1">
                        {alerts.map((alert, i) => (
                            <div
                                key={`${alert.title}-${i}`}
                                className="flex items-start gap-3 py-3"
                                style={
                                    i < alerts.length - 1
                                        ? { borderBottom: "1px solid var(--color-border-card)" }
                                        : undefined
                                }
                            >
                                <div
                                    className="flex items-center justify-center size-8 rounded-lg shrink-0"
                                    style={{ backgroundColor: alert.iconBg }}
                                >
                                    <span style={{ color: alert.iconColor }}>
                                        {alert.icon}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] font-medium text-text-primary">
                                        {alert.title}
                                    </span>
                                    <span className="text-[11px] text-text-muted">
                                        {alert.desc}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex min-h-[260px] flex-col rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-6 lg:h-[340px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Atividade Recente
                        </h3>
                        <span className="text-xs font-medium text-text-secondary">
                            Ver tudo
                        </span>
                    </div>
                    <div className="flex flex-col flex-1">
                        {activities.length > 0 ? (
                            activities.map((act: any, i: number) => (
                                <div
                                    key={`${act.title}-${i}`}
                                    className="flex items-center gap-3 py-3"
                                    style={
                                        i < activities.length - 1
                                            ? {
                                                borderBottom:
                                                    "1px solid var(--color-border-card)",
                                            }
                                            : undefined
                                    }
                                >
                                    <div
                                        className="flex items-center justify-center size-8 rounded-lg shrink-0"
                                        style={{ backgroundColor: act.iconBg }}
                                    >
                                        <span style={{ color: act.iconColor }}>
                                            {act.icon}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="truncate text-[13px] font-medium text-text-primary">
                                            {act.title}
                                        </span>
                                        <span className="text-[11px] text-text-muted">
                                            {act.time}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
                                Nenhuma atividade recente
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHour < 24) return `há ${diffHour}h`;
    if (diffDay === 1) return "ontem";
    if (diffDay < 7) return `há ${diffDay} dias`;
    return date.toLocaleDateString("pt-BR");
}
