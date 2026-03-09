"use client";
import { Slot } from "@radix-ui/react-slot";
import {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  createContext,
  useContext,
  ComponentRef,
  forwardRef,
} from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  useForm,
} from "react-hook-form";
import { classNames } from "../../utils/tw.utils";
import { Label } from "./label.component";

interface CustomFormProps<
  TFieldValues extends FieldValues = FieldValues,
> extends React.FormHTMLAttributes<HTMLFormElement> {
  form: ReturnType<typeof useForm<TFieldValues>>;
}

const CustomForm = <TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  className,
  children,
  ...props
}: CustomFormProps<TFieldValues>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={className} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { name } = fieldContext;

  return {
    name,
    ...fieldState,
  };
};

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames("space-y-2", className)}
        {...props}
      />
    );
  },
);

FormItem.displayName = "FormItem";

const FormLabel = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label> & {
  ref?: React.Ref<React.ComponentRef<typeof Label>>;
}) => {
  const { name } = useFormField();

  return (
    <Label
      ref={ref}
      className={classNames(
        "block text-xs font-semibold text-text-secondary",
        className,
      )}
      htmlFor={name}
      {...props}
    />
  );
};
FormLabel.displayName = "FormLabel";

const FormControl = ({
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Slot> & {
  ref?: React.Ref<ComponentRef<typeof Slot>>;
}) => {
  const { error } = useFormField();

  //@ts-ignore
  return <Slot ref={ref} aria-invalid={!!error} {...props} />;
};

FormControl.displayName = "FormControl";

const FormMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={classNames("text-sm font-medium text-red-500", className)}
      {...props}
    >
      {body}
    </p>
  );
});

FormMessage.displayName = "FormMessage";

export {
  useFormField,
  CustomForm as Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
};
