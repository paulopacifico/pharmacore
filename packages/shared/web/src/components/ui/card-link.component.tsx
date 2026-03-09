import Link from "next/link";
import { classNames } from "../../utils/tw.utils";

type CardLinkProps = {
  title: string;
  description?: string;
  href: string;
  cta?: string;
  className?: string;
};

export function CardLink({
  title,
  description,
  href,
  cta = "Acessar",
  className,
}: CardLinkProps) {
  return (
    <Link
      href={href}
      className={classNames(
        "group relative rounded-xl border border-white/10 bg-black/10 p-6",
        "transition hover:border-white/20 hover:bg-white/5",
        className ?? "",
      )}
    >
      <div className="text-lg font-semibold text-white">{title}</div>
      {description ? (
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      ) : null}
      <span className="mt-6 inline-flex text-sm font-semibold text-white">
        {cta}
      </span>
    </Link>
  );
}
