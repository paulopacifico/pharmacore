"use client";

import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import BrazilMap from "@react-map/brazil";
import {
  ArchiveBoxIcon,
  ArrowRightIcon,
  BoltIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  CpuChipIcon,
  MinusIcon,
  PlusIcon,
  RectangleGroupIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/landing/fade-in";

/* ─── Data ─── */

const capabilities = [
  {
    label: "Catálogo governado",
    detail:
      "Padronize produtos, SKUs e categorias com fluxo único para toda a operação.",
    icon: ArchiveBoxIcon,
  },
  {
    label: "Acesso por papel",
    detail:
      "Segregação de função com permissões granulares, logs e rastreabilidade completa.",
    icon: UsersIcon,
  },
  {
    label: "Dados em tempo real",
    detail:
      "Dashboards operacionais com gargalos, produtividade e cobertura por filial.",
    icon: ChartBarIcon,
  },
  {
    label: "Escala sem retrabalho",
    detail:
      "Automatize rotinas de cadastro e manutenção para reduzir erros e acelerar entregas.",
    icon: BoltIcon,
  },
];

const steps = [
  {
    num: "01",
    title: "Mapeamento",
    body: "Consolidamos seu catálogo atual, validamos a estrutura e iniciamos com dados organizados desde o primeiro dia.",
  },
  {
    num: "02",
    title: "Modelagem",
    body: "Configuramos categorias, políticas de cadastro e níveis de aprovação de acordo com seu processo.",
  },
  {
    num: "03",
    title: "Operação assistida",
    body: "Sua equipe opera com acompanhamento e playbooks, garantindo aderência e produtividade imediata.",
  },
  {
    num: "04",
    title: "Gestão contínua",
    body: "Acompanhe KPIs, audite alterações e evolua o processo com ciclos curtos orientados por dados.",
  },
];

const modules = [
  {
    icon: Squares2X2Icon,
    name: "Core de catálogo",
    description:
      "Gestão centralizada de produtos, marcas e categorias com padrão de dados consistente para toda a rede.",
    features: [
      "Cadastro centralizado com imagem e atributos",
      "Padronização de nomenclatura e classificação",
      "Histórico completo de alterações por produto",
    ],
    accent: "#4F46E5",
  },
  {
    icon: ShieldCheckIcon,
    name: "Auth e segurança",
    description:
      "Controle de acesso enterprise-grade para reduzir risco operacional e aumentar governança.",
    features: [
      "Papéis e permissões granulares por área",
      "Alertas de segurança e falhas de login",
      "Painel de auditoria com visão administrativa",
    ],
    accent: "#6366F1",
  },
  {
    icon: BuildingStorefrontIcon,
    name: "Rede de filiais",
    description:
      "Monitore cobertura nacional, concentração por estado e saúde operacional de toda a sua rede.",
    features: [
      "Mapa de distribuição por UF",
      "Indicadores de ativação por filial",
      "Acesso rápido para manutenção da rede",
    ],
    accent: "#7C3AED",
  },
  {
    icon: RectangleGroupIcon,
    name: "Command center",
    description:
      "Um cockpit único para acompanhar performance, exceções e prioridades da operação.",
    features: [
      "Visão consolidada entre módulos",
      "KPIs com leitura rápida para liderança",
      "Alertas e ações recomendadas",
    ],
    accent: "#4338CA",
  },
];

const metrics = [
  { value: 38, suffix: "%", label: "Queda no tempo médio de cadastro" },
  { value: 52, suffix: "%", label: "Redução de retrabalho operacional" },
  { value: 96, suffix: "%", label: "Aderência ao padrão de catálogo" },
  { value: 12, suffix: "h", label: "Para consolidar visão semanal" },
];

const testimonials = [
  {
    quote:
      "Saí de planilhas espalhadas para uma operação com previsibilidade. Hoje decidimos em reunião de 20 minutos.",
    name: "Marina Araújo",
    role: "Diretora de Operações · Rede VidaFarma",
  },
  {
    quote:
      "A governança de acesso acabou com retrabalho e exposição indevida de dados. Compliance aprovou rapidamente.",
    name: "Rafael Souza",
    role: "Head de Segurança · Drogaria Norte",
  },
  {
    quote:
      "O dashboard de filiais trouxe uma visão que antes não existia. Hoje sabemos onde concentrar expansão.",
    name: "Bruna Lima",
    role: "Gerente de Expansão · FarmaMax",
  },
  {
    quote:
      "Conseguimos reduzir erros de cadastro e acelerar onboarding de novos usuários sem sacrificar controle.",
    name: "Henrique Melo",
    role: "Coordenador de Produtos · PharmaOne",
  },
  {
    quote:
      "A padronização do catálogo trouxe uma clareza que não tínhamos. As decisões ficaram muito mais rápidas.",
    name: "Camila Duarte",
    role: "Supervisora de Cadastro · BioFarma",
  },
  {
    quote:
      "Com o command center, passei a ter visão real do que acontece em cada filial sem depender de relatórios manuais.",
    name: "Thiago Alves",
    role: "CEO · DrogaMax",
  },
];

const showcaseSlides = [
  {
    src: "/dashboard.png",
    alt: "Dashboard executivo do PharmaCore",
    label: "Dashboard executivo",
    description: "Visão consolidada de toda a operação com KPIs acionáveis para liderança.",
  },
  {
    src: "/catalogo.png",
    alt: "Catálogo de produtos no PharmaCore",
    label: "Catálogo de produtos",
    description: "Gestão centralizada com padronização de nomenclatura e classificação.",
  },
  {
    src: "/auth.png",
    alt: "Módulo de autenticação no PharmaCore",
    label: "Governança de acesso",
    description: "Controle granular de papéis, permissões e auditoria completa.",
  },
  {
    src: "/filiais.png",
    alt: "Módulo de filiais no PharmaCore",
    label: "Gestão de filiais",
    description: "Controle granular de papéis, permissões e auditoria completa.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    subtitle: "Para operações em estruturação",
    items: [
      "Até 500 produtos",
      "Até 3 usuários",
      "Dashboard base",
      "Suporte por email",
    ],
    cta: "Começar agora",
    featured: false,
  },
  {
    name: "Professional",
    price: "R$ 197",
    period: "/mês",
    subtitle: "Para redes em crescimento acelerado",
    items: [
      "Produtos ilimitados",
      "Até 10 usuários",
      "Dashboards avançados",
      "Permissões por papel",
      "Suporte prioritário",
    ],
    cta: "Iniciar piloto",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    subtitle: "Operações multicidade e alta governança",
    items: [
      "Usuários ilimitados",
      "SLA dedicado",
      "Acompanhamento consultivo",
      "Roadmap conjunto",
    ],
    cta: "Falar com vendas",
    featured: false,
  },
];

const faqs = [
  {
    q: "Quanto tempo leva para colocar em produção?",
    a: "A maioria dos clientes entra em operação inicial entre 2 e 4 semanas, dependendo do volume de dados e da complexidade de regras.",
  },
  {
    q: "O PharmaCore funciona para múltiplas filiais?",
    a: "Sim. A plataforma foi desenhada para redes com múltiplas unidades, com visão consolidada e recortes por estado, cidade e filial.",
  },
  {
    q: "Como funciona o controle de acesso?",
    a: "Você define papéis e permissões por perfil. Cada ação relevante fica registrada para auditoria e compliance.",
  },
  {
    q: "Consigo testar antes de contratar?",
    a: "Sim. Oferecemos período de validação para seu time testar fluxos críticos com dados reais e apoio de onboarding.",
  },
  {
    q: "Existe suporte para integrações?",
    a: "Sim. O plano Enterprise inclui apoio para integrações e desenho de fluxos conforme a arquitetura da sua operação.",
  },
];

/* ─── Components ─── */

function FaqAccordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E8EAF0]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-heading text-[17px] font-semibold text-[#1a1a2e]">
          {q}
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D5D9E6] text-[#6C6F85]">
          {open ? (
            <MinusIcon className="h-3.5 w-3.5" />
          ) : (
            <PlusIcon className="h-3.5 w-3.5" />
          )}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-[15px] leading-relaxed text-[#5A5D72]">{a}</p>
      </motion.div>
    </div>
  );
}

function TestimonialMarquee() {
  const doubled = [...testimonials, ...testimonials];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <motion.div
        className="flex gap-5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((t, i) => (
          <article
            key={`${t.name}-${i}`}
            className="w-[380px] shrink-0 rounded-2xl border border-[#E8EAF0] bg-white p-7"
          >
            <svg
              className="mb-3 h-6 w-6 text-[#4F46E5]/25"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
            </svg>
            <p className="text-[14.5px] leading-[1.7] text-[#3D3F52]">
              {t.quote}
            </p>
            <div className="mt-5 border-t border-[#F0F0F5] pt-4">
              <p className="text-[13.5px] font-semibold text-[#1a1a2e]">
                {t.name}
              </p>
              <p className="mt-0.5 text-[12.5px] text-[#8B8DA0]">{t.role}</p>
            </div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function Showcase() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % showcaseSlides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const go = (dir: number) => {
    setCurrent(
      (prev) =>
        (prev + dir + showcaseSlides.length) % showcaseSlides.length
    );
    resetTimer();
  };

  const slide = showcaseSlides[current];

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-[#E8EAF0] bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1280}
              height={800}
              className="h-auto w-full object-cover"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/80 text-[#1a1a2e] backdrop-blur-sm transition-all hover:bg-white"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/80 text-[#1a1a2e] backdrop-blur-sm transition-all hover:bg-white"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Caption + dots */}
      <div className="mt-6 flex items-end justify-between gap-6">
        <div>
          <p className="font-heading text-[17px] font-semibold text-[#1a1a2e]">
            {slide.label}
          </p>
          <p className="mt-1 max-w-md text-[14px] text-[#6C6F85]">
            {slide.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showcaseSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                resetTimer();
              }}
              className={`h-2 rounded-full transition-all ${i === current
                ? "w-6 bg-[#4F46E5]"
                : "w-2 bg-[#D5D9E6] hover:bg-[#B0B4C8]"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <main className="overflow-x-hidden bg-white text-[#1a1a2e]">
      {/* ─── Nav ─── */}
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto max-w-[1320px] px-6 pt-4 md:px-10">
          <nav className="flex items-center justify-between rounded-2xl border border-[#1a1a2e]/[0.06] bg-white/80 px-6 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <Link href="#top" aria-label="Voltar ao topo">
              <Image
                src="/logo.png"
                alt="PharmaCore"
                height={28}
                width={0}
                className="h-7 w-auto"
              />
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {[
                { label: "Plataforma", href: "#plataforma" },
                { label: "Módulos", href: "#modulos" },
                { label: "Resultados", href: "#resultados" },
                { label: "Preços", href: "#precos" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[13px] font-medium text-[#6C6F85] transition-colors hover:text-[#1a1a2e]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="rounded-lg bg-[#4F46E5] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-[#4338CA]"
              >
                Entrar
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section ref={heroRef} id="top" className="relative overflow-hidden bg-[#F9F8FE] pb-20 pt-28">
        {/* Subtle background texture */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#4F46E5]/[0.04] blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#7C3AED]/[0.04] blur-[100px]" />
        </div>
        {/* Fine dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `radial-gradient(circle, #4F46E5 0.5px, transparent 0.5px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="mx-auto max-w-[800px] text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4F46E5]/15 bg-white px-4 py-1.5 text-[13px] font-medium text-[#4F46E5] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                Plataforma para redes farmacêuticas
              </div>
            </FadeIn>

            <FadeIn delay={0.07}>
              <h1 className="mt-8 font-heading text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.08] tracking-[-0.035em] text-[#1a1a2e]">
                Sua operação farmacêutica,{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                  sob controle real
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.12}>
              <p className="mx-auto mt-6 max-w-[520px] text-[17px] leading-[1.7] text-[#6C6F85]">
                Centralize catálogo, usuários, permissões e rede de filiais em
                uma camada única. Ganhe velocidade sem abrir mão de segurança.
              </p>
            </FadeIn>

            <FadeIn delay={0.17}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/sign-in"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-[#4F46E5] px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#4338CA] hover:shadow-[0_8px_30px_-6px_rgba(79,70,229,0.35)]"
                >
                  Iniciar avaliação gratuita
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#modulos"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D5D9E6] bg-white px-7 py-3.5 text-[15px] font-semibold text-[#1a1a2e] transition-all hover:border-[#4F46E5]/30 hover:text-[#4F46E5]"
                >
                  Ver plataforma
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Hero screenshot */}
          <FadeIn delay={0.24} className="mt-14">
            <motion.div
              style={{ y: heroImageY }}
              className="relative mx-auto max-w-[1100px] rounded-2xl border border-[#E0DFF0] bg-white p-2.5 shadow-[0_4px_40px_-12px_rgba(79,70,229,0.10)]"
            >
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/dashboard.png"
                  alt="Visão executiva do PharmaCore"
                  width={1280}
                  height={800}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>

              {/* Floating pill stats */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-6 rounded-full border border-[#E0DFF0] bg-white px-8 py-3 shadow-[0_4px_20px_-6px_rgba(79,70,229,0.10)]">
                  {[
                    { val: "27 UFs", sub: "Monitoradas" },
                    { val: "< 2s", sub: "Resposta" },
                    { val: "99.9%", sub: "Uptime" },
                  ].map((s, i) => (
                    <div key={s.val} className="flex items-center gap-6">
                      {i > 0 && <div className="h-6 w-px bg-[#E8EAF0]" />}
                      <div className="text-center">
                        <p className="font-heading text-[15px] font-bold text-[#1a1a2e]">
                          {s.val}
                        </p>
                        <p className="text-[11px] text-[#8B8DA0]">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Capabilities ─── */}
      <section id="plataforma" className="bg-white py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <FadeIn className="lg:sticky lg:top-32">
              <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
                Valor de negócio
              </p>
              <h2 className="mt-4 font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
                Projetado para operação real,{" "}
                <span className="text-[#6C6F85]">não para demo.</span>
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-[1.7] text-[#6C6F85]">
                Cada área ganha um fluxo claro — cadastro com padrão, acesso com
                governança, filiais com visão geográfica e liderança com
                indicadores acionáveis.
              </p>
            </FadeIn>

            <StaggerContainer
              className="grid gap-4 sm:grid-cols-2"
              staggerDelay={0.08}
            >
              {capabilities.map((cap) => (
                <StaggerItem key={cap.label}>
                  <div className="flex h-full flex-col rounded-2xl border border-[#E8EAF0] bg-[#FAFAFF] p-6 transition-all hover:border-[#4F46E5]/20 hover:bg-[#F5F3FF]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDEBFF] text-[#4F46E5]">
                      <cap.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-heading text-[15px] font-semibold text-[#1a1a2e]">
                      {cap.label}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[#6C6F85]">
                      {cap.detail}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="bg-[#FAFAFF] py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
              Implementação
            </p>
            <h2 className="mt-4 font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
              Da planilha à produção em semanas
            </h2>
          </FadeIn>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[#E8EAF0] bg-[#E8EAF0] md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.06}>
                <article className="flex h-full flex-col bg-white p-7">
                  <span className="font-heading text-[32px] font-bold text-[#4F46E5]/[0.12]">
                    {step.num}
                  </span>
                  <h3 className="mt-3 font-heading text-[17px] font-semibold text-[#1a1a2e]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#6C6F85]">
                    {step.body}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-10">
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6D28D9] px-8 py-8 sm:flex-row sm:items-center">
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">
                  Go-live assistido
                </p>
                <p className="mt-2 max-w-xl font-heading text-[20px] font-bold leading-snug text-white">
                  Nossa equipe apoia setup, validação e adoção para que o ganho
                  de produtividade apareça rápido.
                </p>
              </div>
              <Link
                href="/auth/sign-in"
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-[14px] font-semibold text-[#4F46E5] transition-all hover:shadow-[0_4px_20px_-4px_rgba(255,255,255,0.3)]"
              >
                Agendar demo
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Modules (Bento) ─── */}
      <section id="modulos" className="bg-white py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <FadeIn>
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
              Suite integrada
            </p>
            <h2 className="mt-4 max-w-lg font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
              Módulos conectados, visão única
            </h2>
          </FadeIn>

          {/* Bento grid */}
          {(() => {
            const Icon0 = modules[0].icon;
            const Icon1 = modules[1].icon;
            const Icon2 = modules[2].icon;
            const Icon3 = modules[3].icon;
            return (
              <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* Module 1 — Large card spanning 2 rows */}
                <FadeIn className="lg:row-span-2">
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8EAF0] transition-all hover:border-[#4F46E5]/20">
                    <div className="bg-gradient-to-br from-[#4F46E5] to-[#6D28D9] px-8 pb-6 pt-8">
                      <Icon0 className="h-7 w-7 text-white/80" />
                      <h3 className="mt-4 font-heading text-[22px] font-bold text-white">
                        {modules[0].name}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                        {modules[0].description}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col justify-between bg-white px-8 py-6">
                      <ul className="flex flex-col gap-3">
                        {modules[0].features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-[#4A4D62]">
                            <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F46E5]" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeIn>

                {/* Module 2 */}
                <FadeIn delay={0.06}>
                  <div className="group flex h-full flex-col rounded-2xl border border-[#E8EAF0] bg-[#FAFAFF] p-7 transition-all hover:border-[#6366F1]/20 hover:bg-[#F5F3FF]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDEBFF] text-[#6366F1] transition-colors group-hover:bg-[#6366F1] group-hover:text-white">
                        <Icon1 className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-[17px] font-semibold text-[#1a1a2e]">
                        {modules[1].name}
                      </h3>
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-[#6C6F85]">
                      {modules[1].description}
                    </p>
                    <ul className="mt-auto flex flex-col gap-2.5 border-t border-[#F0F0F5] pt-5">
                      {modules[1].features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#4A4D62]">
                          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#6366F1]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>

                {/* Module 3 */}
                <FadeIn delay={0.12}>
                  <div className="group flex h-full flex-col rounded-2xl border border-[#E8EAF0] bg-[#FAFAFF] p-7 transition-all hover:border-[#7C3AED]/20 hover:bg-[#F5F3FF]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#7C3AED] transition-colors group-hover:bg-[#7C3AED] group-hover:text-white">
                        <Icon2 className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-[17px] font-semibold text-[#1a1a2e]">
                        {modules[2].name}
                      </h3>
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-[#6C6F85]">
                      {modules[2].description}
                    </p>
                    <ul className="mt-auto flex flex-col gap-2.5 border-t border-[#F0F0F5] pt-5">
                      {modules[2].features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#4A4D62]">
                          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#7C3AED]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>

                {/* Module 4 — wide bottom card */}
                <FadeIn delay={0.18} className="md:col-span-2">
                  <div className="group flex flex-col gap-6 rounded-2xl border border-[#E8EAF0] bg-[#FAFAFF] p-7 transition-all hover:border-[#4338CA]/20 hover:bg-[#F5F3FF] sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDEBFF] text-[#4338CA] transition-colors group-hover:bg-[#4338CA] group-hover:text-white">
                          <Icon3 className="h-5 w-5" />
                        </div>
                        <h3 className="font-heading text-[17px] font-semibold text-[#1a1a2e]">
                          {modules[3].name}
                        </h3>
                      </div>
                      <p className="mt-4 text-[14.5px] leading-relaxed text-[#6C6F85]">
                        {modules[3].description}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-2.5 sm:border-l sm:border-[#F0F0F5] sm:pl-6">
                      {modules[3].features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-[#4A4D62]">
                          <CheckIcon className="h-3.5 w-3.5 shrink-0 text-[#4338CA]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ─── Showcase Carousel ─── */}
      <section className="bg-[#FAFAFF] py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:items-center">
            <FadeIn>
              <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
                Produto
              </p>
              <h2 className="mt-4 font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
                Conheça a plataforma por dentro
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#6C6F85]">
                Navegue pelas telas do PharmaCore e veja como cada módulo
                funciona na prática do dia a dia da sua rede.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Showcase />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Brazil Map / Coverage ─── */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
            <FadeIn className="flex justify-center">
              <div className="relative">
                <BrazilMap
                  type="select-single"
                  size={420}
                  mapColor="#EDEBFF"
                  strokeColor="#C7C3F0"
                  strokeWidth={0.8}
                  hoverColor="#7C3AED"
                  selectColor="#4F46E5"
                  hints
                  hintBackgroundColor="#1a1a2e"
                  hintTextColor="#ffffff"
                  hintPadding="6px 12px"
                  hintBorderRadius={8}
                  cityColors={{
                    "São Paulo": "#4F46E5",
                    "Rio de Janeiro": "#5B52F0",
                    "Minas Gerais": "#6366F1",
                    Bahia: "#7C6EF6",
                    Paraná: "#6D5EF5",
                    "Rio Grande do Sul": "#7C6EF6",
                    "Santa Catarina": "#6D5EF5",
                    Goiás: "#8B7FF7",
                    Pernambuco: "#7C6EF6",
                    Ceará: "#8B7FF7",
                    Pará: "#9A90F8",
                    Maranhão: "#9A90F8",
                    Amazonas: "#A8A0F9",
                    "Espírito Santo": "#8B7FF7",
                    Paraíba: "#9A90F8",
                    "Mato Grosso": "#9A90F8",
                    "Mato Grosso do Sul": "#8B7FF7",
                    "Rio Grande do Norte": "#A8A0F9",
                    Piauí: "#A8A0F9",
                    Alagoas: "#9A90F8",
                    Sergipe: "#A8A0F9",
                    Rondônia: "#B5AEFA",
                    Tocantins: "#B5AEFA",
                    Acre: "#C2BCFB",
                    Amapá: "#C2BCFB",
                    Roraima: "#C2BCFB",
                    "Distrito Federal": "#6366F1",
                  }}
                />
                {/* Decorative ring */}
                <div className="pointer-events-none absolute -inset-8 rounded-full border border-dashed border-[#E0DFF0]" />
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
                Cobertura nacional
              </p>
              <h2 className="mt-4 font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
                Presente em todo o Brasil
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-[1.7] text-[#6C6F85]">
                Monitore sua rede de filiais com visão geográfica completa.
                Acompanhe cobertura por UF, concentração estadual e saúde
                operacional de cada unidade em um mapa interativo.
              </p>

              {/* State branch distribution */}
              <div className="mt-8 grid grid-cols-3 gap-x-5 gap-y-2.5">
                {[
                  { uf: "SP", count: 142 },
                  { uf: "RJ", count: 87 },
                  { uf: "MG", count: 63 },
                  { uf: "BA", count: 38 },
                  { uf: "PR", count: 45 },
                  { uf: "RS", count: 41 },
                  { uf: "SC", count: 34 },
                  { uf: "GO", count: 28 },
                  { uf: "PE", count: 25 },
                  { uf: "CE", count: 22 },
                  { uf: "PA", count: 18 },
                  { uf: "DF", count: 15 },
                ].map((s) => (
                  <div
                    key={s.uf}
                    className="flex items-center justify-between rounded-lg border border-[#F0F0F5] px-3 py-2"
                  >
                    <span className="text-[13px] font-semibold text-[#1a1a2e]">
                      {s.uf}
                    </span>
                    <span className="text-[12px] tabular-nums text-[#6C6F85]">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2">
                <div className="h-2.5 w-14 rounded-full bg-gradient-to-r from-[#EDEBFF] to-[#4F46E5]" />
                <span className="text-[12px] text-[#8B8DA0]">
                  Concentração de filiais por UF
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Metrics ─── */}
      <section id="resultados" className="relative overflow-hidden bg-[#110f24] py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[600px] rounded-full bg-[#4F46E5]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#A5A0FF]">
              Performance
            </p>
            <h2 className="mt-4 font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-white">
              Impacto mensurável na rotina
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-[#9896B0]">
              Menos fricção, mais capacidade de execução com segurança.
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="bg-[#110f24] p-8 text-center">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    className="font-heading text-[42px] font-bold text-white"
                  />
                  <p className="mt-2 text-[13.5px] leading-snug text-[#9896B0]">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials Marquee ─── */}
      <section id="depoimentos" className="bg-white py-28">
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <FadeIn className="mb-14">
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
              Depoimentos
            </p>
            <h2 className="mt-4 max-w-lg font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
              Quem usa, recomenda
            </h2>
          </FadeIn>
        </div>
        <TestimonialMarquee />
      </section>

      {/* ─── Pricing ─── */}
      <section id="precos" className="bg-[#FAFAFF] py-28">
        <div className="mx-auto max-w-[1120px] px-6 md:px-10">
          <FadeIn className="mx-auto max-w-xl text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
              Planos
            </p>
            <h2 className="mt-4 font-heading text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
              Escolha o nível ideal
            </h2>
            <p className="mt-4 text-[16px] text-[#6C6F85]">
              Comece pequeno, valide rápido e escale sem refazer processo.
            </p>
          </FadeIn>

          <StaggerContainer
            className="mt-14 grid gap-5 md:grid-cols-3"
            staggerDelay={0.1}
          >
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <article
                  className={`relative flex h-full flex-col rounded-2xl p-8 transition-all ${plan.featured
                    ? "border-2 border-[#4F46E5] bg-white shadow-[0_4px_24px_-4px_rgba(79,70,229,0.12)]"
                    : "border border-[#E8EAF0] bg-white hover:border-[#C8C5E8]"
                    }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#4F46E5] px-3 py-1 text-[11px] font-semibold text-white">
                      Mais escolhido
                    </span>
                  )}

                  <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6C6F85]">
                    {plan.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-heading text-[32px] font-bold text-[#1a1a2e]">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-[14px] text-[#8B8DA0]">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[13.5px] text-[#6C6F85]">
                    {plan.subtitle}
                  </p>

                  <ul className="mt-7 flex flex-col gap-3 border-t border-[#F0F0F5] pt-7">
                    {plan.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-[13.5px] text-[#4A4D62]"
                      >
                        <CheckIcon className="h-4 w-4 shrink-0 text-[#4F46E5]" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Link
                      href="/auth/sign-in"
                      className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-[14px] font-semibold transition-all ${plan.featured
                        ? "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                        : "border border-[#D5D9E6] text-[#1a1a2e] hover:border-[#4F46E5] hover:text-[#4F46E5]"
                        }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-white py-28">
        <div className="mx-auto max-w-[740px] px-6 md:px-10">
          <FadeIn className="text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#4F46E5]">
              FAQ
            </p>
            <h2 className="mt-4 font-heading text-[clamp(1.8rem,3.2vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#1a1a2e]">
              Perguntas frequentes
            </h2>
          </FadeIn>

          <div className="mt-12">
            {faqs.map((faq) => (
              <FaqAccordion key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#FAFAFF]">
        <div className="mx-auto max-w-[1320px] px-6 pb-0 pt-20 md:px-10">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#6D28D9] px-8 py-20 text-center md:px-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `radial-gradient(circle, #fff 0.5px, transparent 0.5px)`,
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative">
                <h2 className="mx-auto max-w-xl font-heading text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.12] text-white">
                  Transforme sua operação com uma plataforma enterprise.
                </h2>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                  Fale com nosso time, rode um piloto e prove resultado em pouco
                  tempo.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/auth/sign-in"
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-[15px] font-semibold text-[#4F46E5] transition-all hover:shadow-[0_4px_20px_-4px_rgba(255,255,255,0.3)]"
                  >
                    Começar avaliação
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="#top"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white/80 transition-all hover:border-white/30 hover:text-white"
                  >
                    Voltar ao topo
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#FAFAFF] py-14">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-10">
          <Image
            src="/logo.png"
            alt="PharmaCore"
            height={22}
            width={0}
            className="h-[22px] w-auto"
          />
          <div className="flex flex-wrap items-center gap-8 text-[13px] text-[#8B8DA0]">
            {[
              { label: "Plataforma", href: "#plataforma" },
              { label: "Módulos", href: "#modulos" },
              { label: "Resultados", href: "#resultados" },
              { label: "Preços", href: "#precos" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-[#4F46E5]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-[12px] text-[#B5B7C8]">&copy; 2026 PharmaCore</p>
        </div>
      </footer>
    </main>
  );
}
