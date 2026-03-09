"use client";
import { PencilIcon, TagIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
    FormMessage,
    FormButtonSubmit,
    ButtonCancel,
    FormSection,
    v,
} from "@pharmacore/shared-web";
import {
    updateBrandSchema,
    UpdateBrandFormData,
    CreateBrandFormData,
    createBrandSchema,
} from "../../data";
import { AliasFormItem } from "../shared";
import { PermissionDTO } from "@pharmacore/auth";
import { Can } from "@pharmacore/auth-web";

interface BrandFormProps {
    submitButtonText: string;
    onSubmit:
        | ((data: CreateBrandFormData) => Promise<void>)
        | ((data: UpdateBrandFormData) => Promise<void>);
    onCancel: () => void;
    initialData?: UpdateBrandFormData;
    savePermission: PermissionDTO;
}

export function BrandForm({
    submitButtonText,
    onSubmit,
    onCancel,
    initialData,
    savePermission,
}: BrandFormProps) {
    const schema = initialData ? updateBrandSchema : createBrandSchema;
    const form = useForm({
        resolver: v.resolver(schema as typeof createBrandSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            alias: initialData?.alias ?? "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    async function handleFormSubmit(
        data: CreateBrandFormData | UpdateBrandFormData,
    ) {
        await onSubmit(data as any);
    }

    return (
        <Form form={form} onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="lg:col-span-3 max-w-7xl py-8 sm:py-16">
                <div className="space-y-6">
                    <FormSection
                        title="Informações da Marca"
                        description="Atualize as informações básicas da marca"
                        className="mx-0 sm:mx-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel className="flex items-center gap-2">
                                        <TagIcon className="h-4 w-4 text-gray-400" />
                                        Nome
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite o nome da marca"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="alias"
                            render={({ field }) => (
                                <AliasFormItem
                                    name={form.watch("name")}
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={form.formState.errors.alias?.message}
                                />
                            )}
                        />
                    </FormSection>

                    <div className="flex flex-col-reverse gap-3 pt-6 sm:mx-12 sm:flex-row sm:justify-end sm:gap-5">
                        <ButtonCancel callback={onCancel}>
                            <XCircleIcon className="h-4 w-4" />
                            Cancelar
                        </ButtonCancel>
                        <Can requiredPermissions={[savePermission]}>
                            <FormButtonSubmit>
                                <PencilIcon className="h-4 w-4" />
                                {submitButtonText}
                            </FormButtonSubmit>
                        </Can>
                    </div>
                </div>
            </div>
        </Form>
    );
}
