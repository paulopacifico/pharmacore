"use client";

const companies = [
  "FarmaPlus",
  "Rede DrogaStar",
  "FarmaVida",
  "DrogaBem",
  "PharmaGroup",
  "FarmaExpress",
  "DrogaMax",
  "FarmaCenter",
  "RedeNova",
  "BioFarma",
];

export function CompanyMarquee() {
  return (
    <div className="relative overflow-hidden py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#FAF9FF] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#FAF9FF] to-transparent" />
      <div className="flex animate-marquee gap-12">
        {[...companies, ...companies].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="shrink-0 text-[15px] font-semibold text-[#C0BDD0] transition-colors hover:text-[#6B6B6B]"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

