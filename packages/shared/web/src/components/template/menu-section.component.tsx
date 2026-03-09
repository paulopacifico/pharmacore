import { classNames } from "@pharmacore/shared-web";
import Link from "next/link";

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
}

interface MenuSectionProps {
    title?: string;
    items: NavigationItem[];
}

export function MenuSection({ items, title }: MenuSectionProps) {
    return (
        <div>
            {title && (
                <div className="text-xs/6 font-semibold text-gray-400 my-1">
                    {title}
                </div>
            )}

            <ul role="list" className="-mx-2 space-y-1">
                {items.map((item) => (
                    <li key={item.name}>
                        <Link
                            href={item.href}
                            className={classNames(
                                item.current
                                    ? "bg-white/5 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                        >
                            <item.icon
                                aria-hidden="true"
                                className={classNames(
                                    item.current
                                        ? "text-white"
                                        : "text-gray-400 group-hover:text-white",
                                    "size-6 shrink-0",
                                )}
                            />
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
