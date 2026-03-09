"use client";

import { HTMLAttributes } from "react";
import { classNames } from "../../utils/tw.utils";

interface PageTitleProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
}

export function PageTitle({ title, subtitle, className }: PageTitleProps) {
    return (
        <div className={classNames("space-y-2 mb-5 mt-2", className)}>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
    );
}
