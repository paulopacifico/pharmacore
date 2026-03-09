"use client";
import {
    ListBulletIcon,
    PencilIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { AddSubcategoryInput } from ".";
import {
    UpdateCategorySchema,
    UpdateCategoryFormData,
    CreateCategoryFormData,
    createCategorySchema,
} from "../../data";
import { SubcategoryFormInput } from "./subcategory-form-input.component";
import { Alias } from "@pharmacore/shared";
import { AliasFormItem } from "../shared";
import { PermissionDTO } from "@pharmacore/auth";
import { Can } from "@pharmacore/auth-web";

interface CategoryFormProps {
    submitButtonText: string;
    onSubmit:
        | ((data: CreateCategoryFormData) => Promise<void>)
        | ((data: UpdateCategoryFormData) => Promise<void>);
    onCancel: () => void;
    initialData?: UpdateCategoryFormData;
    savePermission: PermissionDTO;
}

export function CategoryForm({
    submitButtonText,
    onSubmit,
    onCancel,
    initialData,
    savePermission,
}: CategoryFormProps) {
    const schema = initialData ? UpdateCategorySchema : createCategorySchema;
    const form = useForm({
        resolver: v.resolver(schema as typeof createCategorySchema),
        defaultValues: {
            name: initialData?.name ?? "",
            alias: initialData?.alias ?? "",
            subcategories: initialData?.subcategories ?? ([] as any),
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const watchedSubcategories = form.watch("subcategories");

    const handleAddSubcategory = (name: string) => {
        const currentSubcategories = form.getValues("subcategories") || [];
        form.setValue("subcategories", [
            ...currentSubcategories,
            {
                id: undefined,
                name,
                alias: Alias.fromText(name).value,
            },
        ]);
    };

    async function handleFormSubmit(
        data: CreateCategoryFormData | UpdateCategoryFormData,
    ) {
        await onSubmit(data as any);
    }
    const subcategoriesErrors = form.formState.errors.subcategories;

    return (
        <Form form={form} onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="lg:col-span-3 max-w-7xl py-8 sm:py-16">
                <div className="space-y-6">
                    <FormSection
                        title="Informações da Categoria"
                        description="Atualize as informações básicas da categoria"
                        className="mx-0 sm:mx-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel className="flex items-center gap-2">
                                        <ListBulletIcon className="h-4 w-4 text-gray-400" />
                                        Nome da Categoria
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Medicamentos"
                                            {...field}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
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

                    <FormSection
                        title="Subcategorias"
                        description="Gerencie as subcategorias desta categoria"
                        className="mx-0 sm:mx-8"
                    >
                        <div className="space-y-4 sm:col-span-2">
                            {(watchedSubcategories ?? []).length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-300">
                                        Subcategorias:
                                    </h4>
                                    {watchedSubcategories && (
                                        <SubcategoryFormInput
                                            errors={subcategoriesErrors as any}
                                            subcategories={watchedSubcategories}
                                            onSubcategoriesChange={(updated) =>
                                                form.setValue(
                                                    "subcategories",
                                                    updated,
                                                )
                                            }
                                        />
                                    )}
                                </div>
                            )}
                            {(watchedSubcategories ?? []).length > 0 && (
                                <div className="h-0.5 border-t border-gray-700 mb-2">
                                    {" "}
                                </div>
                            )}
                            <AddSubcategoryInput
                                onAddSubcategory={handleAddSubcategory}
                            />
                        </div>
                    </FormSection>
                </div>

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
        </Form>
    );
}
