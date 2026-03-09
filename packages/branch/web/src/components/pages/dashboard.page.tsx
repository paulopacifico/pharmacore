"use client";

import { useEffect, useRef, useState } from "react";
import {
    Badge,
    Breadcrumb,
    KPICard,
    Loading,
    PageHeader,
    useApp,
} from "@pharmacore/shared-web";
import { useBranchOverview } from "../../data";
import { Can } from "@pharmacore/auth-web";
import { PERMISSIONS } from "@pharmacore/auth";
import {
    BuildingStorefrontIcon,
    CheckCircleIcon,
    GlobeAmericasIcon,
    HomeIcon,
    ListBulletIcon,
    MapPinIcon,
    PlusIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import BrazilMap from "@react-map/brazil";
import Link from "next/link";

const TOTAL_BRAZIL_STATES = 27;
const STATE_NAME_TO_UF = {
    Acre: "AC",
    Alagoas: "AL",
    Amazonas: "AM",
    "Amapá": "AP",
    Bahia: "BA",
    Ceará: "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    Goiás: "GO",
    Maranhão: "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    Pará: "PA",
    Paraíba: "PB",
    Pernambuco: "PE",
    Piauí: "PI",
    Paraná: "PR",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    Rondônia: "RO",
    Roraima: "RR",
    "Rio Grande do Sul": "RS",
    "Santa Catarina": "SC",
    Sergipe: "SE",
    "São Paulo": "SP",
    Tocantins: "TO",
} as const;

const BRAZIL_UF_CODES = new Set([
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
]);

const LABEL_OFFSETS: Partial<Record<string, { x: number; y: number }>> = {
    BA: { x: -1.2, y: 0.6 },
    MG: { x: 1.2, y: 1.0 },
    PI: { x: -1.1, y: 0.5 },
    RS: { x: -0.6, y: 0.8 },
    SC: { x: -0.5, y: 0.3 },
    SP: { x: 1.8, y: 2.4 },
    RJ: { x: 4.8, y: 1.2 },
    ES: { x: 4.2, y: 1.4 },
    DF: { x: 1.5, y: 0.2 },
    SE: { x: 3.8, y: 0.6 },
    AL: { x: 3.6, y: -0.2 },
    PB: { x: 3.2, y: -0.6 },
    RN: { x: 2.6, y: -0.8 },
};

const TOP_LABEL_PRIORITY = new Set(["SP", "RJ", "ES", "DF", "SE", "AL", "PB", "RN"]);

function findLabelPointInState(
    path: SVGPathElement,
    svg: SVGSVGElement,
    box: DOMRect,
): { x: number; y: number } {
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    const isInside = (x: number, y: number) => {
        const point = svg.createSVGPoint();
        point.x = x;
        point.y = y;
        return path.isPointInFill(point);
    };

    if (isInside(centerX, centerY)) {
        return { x: centerX, y: centerY };
    }

    const maxRadius = Math.max(box.width, box.height) / 2;
    const radiusStep = Math.max(maxRadius / 6, 1.25);

    for (let radius = radiusStep; radius <= maxRadius; radius += radiusStep) {
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            if (
                x < box.x ||
                x > box.x + box.width ||
                y < box.y ||
                y > box.y + box.height
            ) {
                continue;
            }

            if (isInside(x, y)) {
                return { x, y };
            }
        }
    }

    return { x: centerX, y: centerY };
}

export function Dashboard() {
    const { overview, isLoading } = useBranchOverview();
    const { themeMode } = useApp();
    const [selectedStateUf, setSelectedStateUf] = useState<string | null>(null);
    const [selectedStateName, setSelectedStateName] = useState<string | null>(
        null,
    );
    const mapWrapperRef = useRef<HTMLDivElement | null>(null);
    const byState = overview?.byState ?? [];

    const stateCountMap = new Map(
        byState.map((item) => [item.state.toUpperCase(), item.count]),
    );

    const maxStateCount = Math.max(...byState.map((item) => item.count), 1);
    const isLightMode = themeMode === "light";
    const mapBaseColor = isLightMode ? "#DDE7F6" : "#273144";
    const mapStrokeColor = isLightMode ? "#AFC1D8" : "#4A5973";
    const mapHintBackgroundColor = isLightMode ? "#FFFFFF" : "#1B2230";
    const mapHintTextColor = isLightMode ? "#0F172A" : "#EEF1FF";
    const cityColors: Record<string, string> = Object.fromEntries(
        Object.entries(STATE_NAME_TO_UF).map(([stateName, uf]) => {
            const count = stateCountMap.get(uf) ?? 0;
            const intensity = count > 0 ? count / maxStateCount : 0;
            const minAlpha = isLightMode ? 0.24 : 0.18;
            const alphaScale = isLightMode ? 0.5 : 0.62;

            return [stateName, `rgba(59, 130, 246, ${minAlpha + intensity * alphaScale})`];
        }),
    );

    const selectedStateCount = selectedStateUf
        ? stateCountMap.get(selectedStateUf) ?? 0
        : null;

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            const wrapper = mapWrapperRef.current;
            const svg = wrapper?.querySelector("svg");

            if (!svg) {
                return;
            }

            const ns = "http://www.w3.org/2000/svg";
            const viewWidth = svg.viewBox.baseVal.width || 100;
            const fontSize = Math.max((viewWidth / 420) * 9, 2.6);
            const radius = fontSize * 1.05;
            const stateCountLookup = new Map(
                byState.map((item) => [item.state.toUpperCase(), item.count]),
            );
            const labels: Array<{
                uf: string;
                count: number;
                x: number;
                y: number;
                area: number;
            }> = [];

            svg.querySelectorAll(".branch-count-label").forEach((node) => {
                node.remove();
            });

            svg.querySelectorAll<SVGPathElement>("path[id]").forEach((path) => {
                const stateName = path.id.replace(/-[^-]+$/, "");
                const uf =
                    STATE_NAME_TO_UF[stateName as keyof typeof STATE_NAME_TO_UF];
                if (!uf || !BRAZIL_UF_CODES.has(uf)) return;

                const count = stateCountLookup.get(uf) ?? 0;
                const box = path.getBBox();
                const area = box.width * box.height;
                const point = findLabelPointInState(path, svg, box);
                const offset = LABEL_OFFSETS[uf];

                labels.push({
                    uf,
                    count,
                    x: point.x + (offset?.x ?? 0),
                    y: point.y + (offset?.y ?? 0),
                    area,
                });
            });

            labels
                .sort((a, b) => {
                    const aPriority = TOP_LABEL_PRIORITY.has(a.uf) ? 1 : 0;
                    const bPriority = TOP_LABEL_PRIORITY.has(b.uf) ? 1 : 0;
                    if (aPriority !== bPriority) return aPriority - bPriority;
                    return b.area - a.area;
                })
                .forEach((label) => {
                    const localRadius =
                        label.area < 90 ? radius * 0.88 : radius;

                    const group = document.createElementNS(ns, "g");
                    group.setAttribute("class", "branch-count-label");
                    group.setAttribute("pointer-events", "none");

                    const circle = document.createElementNS(ns, "circle");
                    circle.setAttribute("cx", String(label.x));
                    circle.setAttribute("cy", String(label.y));
                    circle.setAttribute("r", String(localRadius));
                    circle.setAttribute(
                        "fill",
                        label.count > 0
                            ? "rgba(15, 23, 42, 0.92)"
                            : isLightMode
                                ? "rgba(248, 250, 252, 0.96)"
                                : "rgba(39, 49, 68, 0.9)",
                    );
                    circle.setAttribute(
                        "stroke",
                        label.count > 0
                            ? "rgba(96, 165, 250, 0.85)"
                            : isLightMode
                                ? "rgba(148, 163, 184, 0.82)"
                                : "rgba(110, 126, 152, 0.7)",
                    );
                    circle.setAttribute("stroke-width", String(fontSize * 0.15));

                    const text = document.createElementNS(ns, "text");
                    text.setAttribute("x", String(label.x));
                    text.setAttribute("y", String(label.y));
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("dominant-baseline", "middle");
                    text.setAttribute("font-size", String(fontSize));
                    text.setAttribute("font-weight", "700");
                    text.setAttribute("font-family", "var(--font-body), sans-serif");
                    text.setAttribute(
                        "fill",
                        label.count > 0
                            ? "#EEF1FF"
                            : isLightMode
                                ? "rgba(51, 65, 85, 0.92)"
                                : "rgba(213, 218, 236, 0.85)",
                    );
                    text.textContent = String(label.count);

                    group.append(circle, text);
                    svg.append(group);
                });
        });

        return () => cancelAnimationFrame(raf);
    }, [byState, isLightMode]);

    if (isLoading || !overview) {
        return <Loading />;
    }

    const { kpi, recentBranches } = overview;

    const activeRate = kpi.total > 0 ? Math.round((kpi.active / kpi.total) * 100) : 0;
    const coverageRate = Math.min(
        Math.round((kpi.statesCount / TOTAL_BRAZIL_STATES) * 100),
        100,
    );
    const topState = byState[0];
    const topStateShare =
        topState && kpi.total > 0
            ? Math.round((topState.count / kpi.total) * 100)
            : 0;
    const avgByCoveredState =
        kpi.statesCount > 0 ? (kpi.total / kpi.statesCount).toFixed(1) : "0";

    const kpis = [
        {
            label: "Filiais Cadastradas",
            value: kpi.total,
            icon: <BuildingStorefrontIcon className="size-5" />,
            bgColor: "#6FCFBE",
            textColor: "#1A6156",
            badgeBgColor: "#1A615633",
            trend: {
                value: `${kpi.total} unidades na rede`,
                positive: true,
            },
        },
        {
            label: "Taxa de Ativação",
            value: `${activeRate}%`,
            icon: <CheckCircleIcon className="size-5" />,
            bgColor: "#6F98E6",
            textColor: "#25508F",
            badgeBgColor: "#25508F33",
            trend: {
                value: `${kpi.active} ativas de ${kpi.total}`,
                positive: activeRate >= 80,
            },
        },
        {
            label: "Cobertura Nacional",
            value: `${kpi.statesCount}/${TOTAL_BRAZIL_STATES}`,
            icon: <GlobeAmericasIcon className="size-5" />,
            bgColor: "#A9B6D9",
            textColor: "#2F466E",
            badgeBgColor: "#2F466E33",
            trend: {
                value: `${coverageRate}% dos estados atendidos`,
                positive: coverageRate >= 60,
            },
        },
        {
            label: "Filiais Inativas",
            value: kpi.inactive,
            icon: <XCircleIcon className="size-5" />,
            bgColor: "#E6C983",
            textColor: "#7A5C19",
            badgeBgColor: "#7A5C1933",
            trend: {
                value:
                    kpi.total > 0
                        ? `${Math.round((kpi.inactive / kpi.total) * 100)}% da rede`
                        : "Sem dados",
                positive: kpi.inactive === 0,
            },
        },
    ];

    const lastBranch = recentBranches[0];

    return (
        <Can requiredPermissions={[PERMISSIONS.BRANCH.READ]}>
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Dashboard de Filiais"
                    subtitle="Visão executiva da rede com cobertura geográfica, saúde operacional e acessos rápidos."
                    breadcrumb={
                        <Breadcrumb
                            items={[
                                {
                                    name: "Início",
                                    href: "/dashboard",
                                    current: false,
                                },
                                {
                                    name: "Filiais",
                                    href: "/admin/branches",
                                    current: false,
                                },
                                {
                                    name: "Dashboard",
                                    href: "/admin/branches",
                                    current: true,
                                },
                            ]}
                        />
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((kpiItem) => (
                        <KPICard
                            key={kpiItem.label}
                            icon={kpiItem.icon}
                            value={kpiItem.value}
                            label={kpiItem.label}
                            bgColor={kpiItem.bgColor}
                            textColor={kpiItem.textColor}
                            badgeBgColor={kpiItem.badgeBgColor}
                            trend={kpiItem.trend}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[13px] font-medium text-text-muted">
                        Acesso rápido
                    </span>
                    <div className="h-5 w-px bg-border-card" />

                    <QuickActionChip
                        href="/admin/branches/list"
                        label="Gerenciar Filiais"
                        icon={<ListBulletIcon className="size-3.5" />}
                        color="#7B93B7"
                    />

                    <Can requiredPermissions={[PERMISSIONS.BRANCH.CREATE]}>
                        <QuickActionChip
                            href="/admin/branches/create"
                            label="Cadastrar Filial"
                            icon={<PlusIcon className="size-3.5" />}
                            color="#8B90A3"
                        />
                    </Can>

                    {lastBranch ? (
                        <QuickActionChip
                            href={`/admin/branches/details/${lastBranch.id}`}
                            label="Última Filial"
                            icon={<BuildingStorefrontIcon className="size-3.5" />}
                            color="#6B8F97"
                        />
                    ) : null}

                    <QuickActionChip
                        href="/dashboard"
                        label="Dashboard Geral"
                        icon={<HomeIcon className="size-3.5" />}
                        color="#6E9A80"
                    />
                </div>

                <div className="grid gap-4">
                    <div className="rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-6">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h3 className="font-heading text-base font-semibold text-text-primary">
                                    Distribuição Geográfica da Rede
                                </h3>
                                <p className="mt-1 text-[12px] text-text-muted">
                                    Mapa por UF com intensidade proporcional ao volume de filiais.
                                </p>
                            </div>
                            <Badge variant="info" size="sm">
                                {byState.length} UFs com operação
                            </Badge>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                            <div className="rounded-[12px] border border-border-card bg-bg-page/65 p-4">
                                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    <div
                                        ref={mapWrapperRef}
                                        className="relative mx-auto w-[320px] sm:w-[380px] lg:w-[420px]"
                                    >
                                        <div className="pointer-events-none absolute left-0 top-2 z-10 rounded-[10px] border border-border-card bg-bg-card/95 px-2.5 py-1.5 text-[11px] text-text-secondary">
                                            {selectedStateUf ? (
                                                <span>
                                                    <span className="font-semibold text-text-primary">
                                                        {selectedStateUf}
                                                    </span>{" "}
                                                    • {selectedStateName} •{" "}
                                                    <span className="font-semibold text-text-primary">
                                                        {selectedStateCount}
                                                    </span>{" "}
                                                    filiais
                                                </span>
                                            ) : (
                                                <span>
                                                    Clique em uma UF para ver o
                                                    total.
                                                </span>
                                            )}
                                        </div>
                                        <BrazilMap
                                            type="select-single"
                                            size={420}
                                            mapColor={mapBaseColor}
                                            strokeColor={mapStrokeColor}
                                            strokeWidth={0.8}
                                            hoverColor="#60A5FA"
                                            selectColor="#06B6D4"
                                            hints
                                            hintBackgroundColor={mapHintBackgroundColor}
                                            hintTextColor={mapHintTextColor}
                                            hintPadding="6px 10px"
                                            hintBorderRadius={8}
                                            cityColors={cityColors}
                                            onSelect={(state) => {
                                                if (!state) {
                                                    setSelectedStateUf(null);
                                                    setSelectedStateName(null);
                                                    return;
                                                }

                                                const uf =
                                                    STATE_NAME_TO_UF[
                                                    state as keyof typeof STATE_NAME_TO_UF
                                                    ] ?? null;
                                                setSelectedStateUf(uf);
                                                setSelectedStateName(state);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-text-muted">
                                    <span className="inline-flex items-center gap-1.5">
                                        <span
                                            className="block size-2.5 rounded-full"
                                            style={{ backgroundColor: mapBaseColor }}
                                        />
                                        baixa concentração
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span className="block size-2.5 rounded-full bg-accent-blue" />
                                        alta concentração
                                    </span>
                                    <span>Os números mostram filiais por UF.</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="rounded-[12px] border border-border-card bg-bg-card-hover p-4">
                                    <h4 className="font-heading text-[13px] font-semibold text-text-primary">
                                        Estados com maior concentração
                                    </h4>
                                    {byState.length > 0 ? (
                                        <div className="mt-3 flex flex-col gap-2.5">
                                            {byState.slice(0, 6).map((item) => (
                                                <div
                                                    key={item.state}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="w-8 shrink-0 text-[11px] font-semibold text-text-secondary">
                                                        {item.state}
                                                    </span>
                                                    <div className="h-2 flex-1 rounded-full bg-border-card">
                                                        <div
                                                            className="h-full rounded-full bg-linear-to-r from-[#3B82F6] to-[#06B6D4]"
                                                            style={{
                                                                width: `${Math.max((item.count / maxStateCount) * 100, 5)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-6 text-right text-[11px] font-semibold text-text-primary">
                                                        {item.count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-3 text-[12px] text-text-muted">
                                            Sem dados de distribuição.
                                        </p>
                                    )}
                                </div>

                                <div className="gap-4 grid grid-cols-2">
                                    <ExecutiveMetricCard
                                        label="Média por UF"
                                        value={`${avgByCoveredState}`}
                                        subtitle="filiais por estado atendido"
                                    />
                                    <ExecutiveMetricCard
                                        label="Concentração Líder"
                                        value={
                                            topState
                                                ? `${topState.state} (${topStateShare}%)`
                                                : "Sem dados"
                                        }
                                        subtitle="participação no total da rede"
                                    />
                                </div>

                                <div className="rounded-[12px] border border-border-card bg-bg-card-hover p-4">
                                    <h4 className="font-heading text-[13px] font-semibold text-text-primary">
                                        Última atualização operacional
                                    </h4>
                                    <p className="mt-1 text-[12px] text-text-muted">
                                        {new Date().toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="rounded-[14px] border border-border-card bg-bg-card p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-heading text-base font-semibold text-text-primary">
                            Filiais Recentes
                        </h3>
                        <Badge size="sm" variant="cyan">
                            {recentBranches.length} últimos cadastros
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {recentBranches.length > 0 ? (
                            recentBranches.map((branch) => (
                                <Link
                                    key={branch.id}
                                    href={`/admin/branches/details/${branch.id}`}
                                    className="flex items-start gap-2.5 rounded-[10px] border border-border-input bg-bg-input px-3 py-2.5 transition-colors hover:border-accent-blue/70 sm:items-center"
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-accent-blue/15 text-accent-blue">
                                        <MapPinIcon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13px] font-medium text-text-primary">
                                            {branch.name}
                                        </p>
                                        <p className="text-[11px] text-text-muted">
                                            {branch.city}/{branch.state} • {formatDate(branch.createdAt)}
                                        </p>
                                    </div>
                                    <Badge
                                        size="sm"
                                        variant={
                                            branch.isActive
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {branch.isActive ? "Ativa" : "Inativa"}
                                    </Badge>
                                </Link>
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-6 text-sm text-text-muted">
                                Nenhuma filial cadastrada.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Can>
    );
}

function ExecutiveMetricCard({
    label,
    value,
    subtitle,
}: {
    label: string;
    value: string;
    subtitle: string;
}) {
    return (
        <div className="rounded-[12px] border border-border-card bg-bg-card-hover p-3">
            <p className="text-[11px] font-medium text-text-muted">{label}</p>
            <p className="mt-1 text-[17px] font-heading font-semibold text-text-primary">
                {value}
            </p>
            <p className="mt-0.5 text-[11px] text-text-secondary">{subtitle}</p>
        </div>
    );
}

function ExecutiveSignal({
    text,
    tone,
}: {
    text: string;
    tone: "success" | "warning" | "info";
}) {
    const dotColor =
        tone === "success"
            ? "bg-status-success"
            : tone === "warning"
                ? "bg-status-warning"
                : "bg-status-info";

    return (
        <div className="flex items-start gap-2">
            <span className={`mt-1.5 block size-1.5 rounded-full ${dotColor}`} />
            <p className="text-[11px] leading-relaxed text-text-secondary">
                {text}
            </p>
        </div>
    );
}

function QuickActionChip({
    href,
    label,
    icon,
    color,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 rounded-lg border border-border-card bg-bg-card px-3.5 py-2 text-xs font-medium text-text-secondary transition-all hover:bg-bg-card-hover"
        >
            <span style={{ color }}>{icon}</span>
            {label}
        </Link>
    );
}

function formatDate(dateValue: Date | string) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Data indisponível";
    }

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
