"use client";
import { ComponentPropsWithoutRef, ComponentRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { classNames } from "../../utils/tw.utils";

const Label = ({
  className,
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  ref?: React.Ref<ComponentRef<typeof LabelPrimitive.Root>>;
}) => (
  <LabelPrimitive.Root
    //@ts-ignore
    ref={ref}
    className={classNames(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
