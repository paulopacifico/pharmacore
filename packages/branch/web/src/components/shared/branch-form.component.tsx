"use client";

import { useEffect } from "react";
import {
    BuildingOfficeIcon,
    CalendarIcon,
    IdentificationIcon,
    MapPinIcon,
    PencilIcon,
    XCircleIcon,
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
    ButtonCancel,
    FormSection,
    v,
} from "@pharmacore/shared-web";
import { DateVO } from "@pharmacore/shared";
import { branchFormSchema, BranchFormData } from "../../data/schemas";

interface BranchFormProps {
    submitButtonText: string;
    onSubmit: (data: BranchFormData) => Promise<void>;
    onCancel: () => void;
    initialData?: BranchFormData;
}

export function BranchForm({
    onSubmit,
    onCancel,
    initialData,
    submitButtonText,
}: BranchFormProps) {
    const form = useForm({
        resolver: v.resolver(branchFormSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            cnpj: initialData?.cnpj ?? "",
            isActive: initialData?.isActive ?? true,
            establishedAt: initialData?.establishedAt ?? undefined,
            address: {
                street: initialData?.address?.street ?? "",
                number: initialData?.address?.number ?? "",
                complement: initialData?.address?.complement ?? "",
                neighborhood: initialData?.address?.neighborhood ?? "",
                city: initialData?.address?.city ?? "",
                state: initialData?.address?.state ?? "",
                zip: initialData?.address?.zip ?? "",
                country: initialData?.address?.country ?? "Brasil",
            },
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    async function handleFormSubmit(data: BranchFormData) {
        await onSubmit(data);
    }

    return (
        <Form form={form} onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="w-full max-w-7xl py-4 sm:py-6 lg:py-8">
                <div className="space-y-4 sm:space-y-6">
                    <FormSection
                        title="Informações da Filial"
                        description="Dados básicos da filial"
                        className="space-y-4 sm:space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel className="flex items-center gap-2">
                                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                                            Nome
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Farmácia Central"
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
                                name="cnpj"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <IdentificationIcon className="h-4 w-4 text-gray-400" />
                                            CNPJ
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="00.000.000/0001-81"
                                                maxLength={18}
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
                                name="establishedAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                            Data de inauguração
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                value={DateVO.toInputValue(
                                                    field.value as Date,
                                                )}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(
                                                        val
                                                            ? new Date(val)
                                                            : undefined,
                                                    );
                                                }}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2 flex flex-row items-center gap-2">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(field.value)}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </FormControl>
                                        <FormLabel className="mb-2">
                                            Filial ativa
                                        </FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </FormSection>

                    <FormSection
                        title="Endereço"
                        description="Endereço completo da filial"
                        className="space-y-4 sm:space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="address.street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                                        Rua / Avenida
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Av. Paulista"
                                            {...field}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="address.number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: 1000"
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
                                name="address.complement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Loja 1"
                                                {...field}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="address.neighborhood"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Bela Vista"
                                            {...field}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_5rem_1fr] gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="address.city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: São Paulo"
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
                                name="address.state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado (UF)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: SP"
                                                maxLength={2}
                                                {...field}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500 uppercase"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address.zip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: 01310-100"
                                                maxLength={9}
                                                {...field}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="address.country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Brasil"
                                            {...field}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </FormSection>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-5 pt-6">
                    <ButtonCancel callback={onCancel}>
                        <XCircleIcon className="h-4 w-4" />
                        Cancelar
                    </ButtonCancel>
                    <FormButtonSubmit>
                        <PencilIcon className="h-4 w-4" />
                        {submitButtonText}
                    </FormButtonSubmit>
                </div>
            </div>
        </Form>
    );
}
