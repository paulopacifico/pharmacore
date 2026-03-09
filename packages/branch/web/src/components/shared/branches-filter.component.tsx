"use client";

import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
    FormMessage,
    v,
} from "@pharmacore/shared-web";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
    branchesFilterSchema,
    BranchesFilterFormData,
} from "../../data";
import { useBranch } from "../../data";

export function BranchesFilter() {
    const { searchByName, clearSearch } = useBranch();
    const form = useForm<BranchesFilterFormData>({
        resolver: v.resolver(branchesFilterSchema),
        defaultValues: {
            name: "",
        },
    });

    async function handleSubmit(data: BranchesFilterFormData) {
        await searchByName(data.name ?? "");
    }

    async function handleClearSearch() {
        form.reset({ name: "" });
        await clearSearch();
    }

    return (
        <Form
            form={form}
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 flex items-end gap-2"
        >
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="w-full max-w-md">
                        <FormLabel className="mb-1 block text-sm font-medium text-gray-300">
                            Buscar por nome
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Nome da filial"
                                {...field}
                                value={field.value ?? ""}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:border-indigo-400 hover:text-indigo-300"
            >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Buscar
            </button>
            <button
                type="button"
                onClick={() => handleClearSearch()}
                className="inline-flex items-center gap-1 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:border-gray-500 hover:text-white"
            >
                <XMarkIcon className="h-4 w-4" />
                Limpar
            </button>
        </Form>
    );
}
