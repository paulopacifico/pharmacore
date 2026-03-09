"use client";

import { ComponentType } from "react";
import { classNames } from "../../utils/tw.utils";

interface ItemNotFoundProps {
  icon: ComponentType<{ className: string }>;
  title: string;
  description: string;
  className?: string;
  size?: "small" | "medium" | "large" | "extralarge";
}

const sizeConfig = {
  small: {
    container: "min-h-screen",
    iconContainer: "w-10 h-10",
    icon: "h-5 w-5",
    title: "text-base",
    description: "text-xs",
    spacing: "gap-2",
  },
  medium: {
    container: "min-h-screen",
    iconContainer: "w-16 h-16",
    icon: "h-8 w-8",
    title: "text-lg",
    description: "text-sm",
    spacing: "gap-4",
  },
  large: {
    container: "min-h-screen",
    iconContainer: "w-20 h-20",
    icon: "h-10 w-10",
    title: "text-xl",
    description: "text-base",
    spacing: "gap-4",
  },
  extralarge: {
    container: "min-h-screen",
    iconContainer: "w-24 h-24",
    icon: "h-12 w-12",
    title: "text-2xl",
    description: "text-lg",
    spacing: "gap-6",
  },
};

export function ItemNotFound({
  icon: Icon,
  title,
  description,
  className,
  size = "medium",
}: ItemNotFoundProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={classNames(
        `flex items-center justify-center ${config.container}`,
        className,
      )}
    >
      <div className={`text-center space-y-4 ${config.spacing}`}>
        <div
          className={`${config.iconContainer} mx-auto rounded-full bg-red-500/10 flex items-center justify-center`}
        >
          <Icon className={`text-red-400 ${config.icon}`} />
        </div>
        <div className="space-y-2">
          <h3 className={`font-semibold text-white ${config.title}`}>
            {title}
          </h3>
          <p className={`text-gray-400 max-w-sm ${config.description}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
