import Image from "next/image";
import { classNames } from "../../utils/tw.utils";
import Link from "next/link";

export interface LogoProps {
    className?: string;
    href?: string;
}

export function Logo(props: LogoProps) {
    return (
        <Link
            href={props?.href ?? "/dashboard"}
            className="flex items-center gap-2"
        >
            <Image
                alt="PharmaCore"
                src="/logo.png"
                className={classNames("h-8 w-auto", props.className ?? "")}
                height={32}
                width={0}
            />
        </Link>
    );
}
