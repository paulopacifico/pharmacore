"use client";
import {
    PencilIcon,
    XMarkIcon,
    ListBulletIcon,
    BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
    FormMessage,
    FormButtonSubmit,
    SelectAsync,
    ButtonCancel,
    FormSection,
    Select,
    v,
} from "@pharmacore/shared-web";
import { useCallback, useEffect, useState } from "react";
import {
    CreateProductFormData,
    UpdateProductFormData,
    createProductSchema,
    updateProductSchema,
    useCategory,
    findManyBrandsWithFilter,
} from "../../../data";
import { ImageInput } from "./image-input.component";
import { CharacteristicsInput } from "./characteristics-input.component";
import { Textarea } from "@pharmacore/shared-web";
import { AliasFormItem } from "../../shared";
import { PermissionDTO } from "@pharmacore/auth";
import { Can } from "@pharmacore/auth-web";

interface ProductFormProps {
    submitButtonText: string;
    onSubmit:
    | ((data: CreateProductFormData) => Promise<void>)
    | ((data: UpdateProductFormData) => Promise<void>);
    onCancel: () => void;
    initialData?: UpdateProductFormData;
    savePermission: PermissionDTO;
}

export function ProductForm({
    onSubmit,
    onCancel,
    initialData,
    submitButtonText,
    savePermission,
}: ProductFormProps) {
    const { categories, isLoadingCategories, findSubcategoriesByCategoryId } =
        useCategory();

    const [subcategoryOptions, setSubcategoryOptions] = useState<
        { label: string; value: string }[]
    >([]);

    const schema = initialData ? updateProductSchema : createProductSchema;
    const form = useForm({
        resolver: v.resolver(schema as typeof createProductSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            alias: initialData?.alias ?? "",
            price: initialData?.price ?? 0,
            sku: initialData?.sku ?? "",
            imagesURL: initialData?.imagesURL ?? [""],
            category: initialData?.category ?? { id: "", name: "" },
            subcategory: initialData?.subcategory ?? { id: "", name: "" },
            characteristics: initialData?.characteristics ?? [],
            brand: initialData?.brand ?? { id: "", name: "" },
        },
    });

    useEffect(() => {
        (async () => {
            const categoryId = form.watch("category")?.id;
            if (categoryId) {
                const subcategories =
                    await findSubcategoriesByCategoryId(categoryId);
                const options = subcategories.map((subcategory: any) => ({
                    label: subcategory.name,
                    value: subcategory.id,
                }));
                setSubcategoryOptions(options);
            } else {
                setSubcategoryOptions([]);
            }
        })();
    }, [form.watch("category"), findSubcategoriesByCategoryId]);

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    async function handleFormSubmit(
        data: CreateProductFormData | UpdateProductFormData,
    ) {
        await onSubmit(data as any);
    }

    const handleSearchBrands = useCallback(async (searchTerm: string) => {
        const brandsFound = await findManyBrandsWithFilter({
            search: searchTerm,
            page: 1,
            pageSize: 50,
        });
        return brandsFound.data.map((b: { name?: string; id?: string }) => ({
            label: b.name ?? "",
            value: b.id ?? "",
        }));
    }, []);

    return (
        <Form form={form} onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="rounded-card border border-[#3C4450] bg-bg-card pt-2 pb-5 mt-6">
                <FormSection
                    title="Informações Básicas do Produto"
                    description="Defina nome, descrição, SKU e preço principal do item."
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do Produto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Dipirona 500mg"
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

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descreva o produto"
                                        {...field}
                                        rows={4}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: DIP500-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preço (R$)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1.00"
                                            placeholder="0.00"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                    value
                                                        ? parseFloat(value)
                                                        : "",
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                                <FormLabel className="flex items-center gap-2">
                                    <BookmarkIcon className="h-4 w-4 text-gray-400" />
                                    Marca
                                </FormLabel>
                                <FormControl>
                                    <SelectAsync
                                        value={
                                            field.value?.id
                                                ? {
                                                    label: field.value.name,
                                                    value: field.value.id,
                                                }
                                                : undefined
                                        }
                                        onChange={(option) => {
                                            field.onChange({
                                                id: option.value,
                                                name: option.label,
                                            });
                                        }}
                                        onSearch={handleSearchBrands}
                                        placeholder="Selecione uma marca"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection
                    title="Características do Produto"
                    description="Adicione características como cor, tamanho, ingredientes, etc."
                >
                    <CharacteristicsInput
                        characteristics={form.watch("characteristics") || []}
                        onCharacteristicsChange={(characteristics) =>
                            form.setValue("characteristics", characteristics)
                        }
                        errors={form.formState.errors.characteristics}
                    />
                </FormSection>

                <FormSection
                    title="Categorização"
                    description={"Defina a categoria e subcategoria do produto"}
                >
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                                <FormLabel className="flex items-center gap-2">
                                    <ListBulletIcon className="h-4 w-4 text-gray-400" />
                                    Categoria
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        options={categories.map(
                                            (category: any) => ({
                                                label: category.name,
                                                value: category.id,
                                            }),
                                        )}
                                        value={
                                            field.value?.id
                                                ? {
                                                    label: field.value.name,
                                                    value: field.value.id,
                                                }
                                                : undefined
                                        }
                                        onChange={(option) => {
                                            field.onChange({
                                                id: option.value,
                                                name: option.label,
                                            });
                                        }}
                                        disabled={isLoadingCategories}
                                        placeholder="Selecione uma categoria"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                                <FormLabel className="flex items-center gap-2">
                                    <ListBulletIcon className="h-4 w-4 text-gray-400" />
                                    Subcategoria
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        options={subcategoryOptions}
                                        value={
                                            field.value?.id
                                                ? {
                                                    label: field.value.name,
                                                    value: field.value.id,
                                                }
                                                : undefined
                                        }
                                        onChange={(option) => {
                                            field.onChange({
                                                id: option.value,
                                                name: option.label,
                                            });
                                        }}
                                        disabled={
                                            isLoadingCategories ||
                                            !form.watch("category")?.id
                                        }
                                        placeholder="Selecione uma subcategoria"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </FormSection>

                <FormSection
                    title="Imagens do Produto"
                    description="URLs das imagens do produto"
                    className="mx-8"
                >
                    <ImageInput
                        imagesURL={form.watch("imagesURL") || []}
                        onImagesChange={(images) =>
                            form.setValue("imagesURL", images)
                        }
                        errors={form.formState.errors.imagesURL}
                    />
                </FormSection>
                <div className="flex justify-end gap-5 mx-12 pt-6">
                    <ButtonCancel callback={onCancel}>
                        <XMarkIcon className="h-3.5 w-3.5" />
                        Cancelar
                    </ButtonCancel>
                    <Can requiredPermissions={[savePermission]}>
                        <FormButtonSubmit>
                            <PencilIcon className="h-3.5 w-3.5" />
                            {submitButtonText}
                        </FormButtonSubmit>
                    </Can>
                </div>
            </div>
        </Form>
    );
}
