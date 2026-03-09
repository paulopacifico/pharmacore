"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    v,
} from "@pharmacore/shared-web";
import { Name, Text, Email, Id } from "@pharmacore/shared";
import { useForm } from "react-hook-form";
import { useState } from "react";

type TagVO = {
    tryCreate(v: string): {
        isFailure: boolean;
        isOk: boolean;
        errors?: string[];
        instance?: { value: string };
    };
};

const Tag: TagVO = {
    tryCreate(v: string) {
        if (typeof v !== "string" || v.trim() === "") {
            return { isFailure: true, isOk: false, errors: ["INVALID_TAG"] };
        }
        if (v.length < 2) {
            return { isFailure: true, isOk: false, errors: ["TAG_TOO_SHORT"] };
        }
        return { isFailure: false, isOk: true, instance: { value: v.trim() } };
    },
};

type LevelVO = {
    tryCreate(v: number): {
        isFailure: boolean;
        isOk: boolean;
        errors?: string[];
        instance?: { value: number };
    };
};

const Level: LevelVO = {
    tryCreate(v: number) {
        const num = Number(v);
        if (isNaN(num) || num < 1 || num > 10) {
            return { isFailure: true, isOk: false, errors: ["INVALID_LEVEL"] };
        }
        return { isFailure: false, isOk: true, instance: { value: num } };
    },
};

export default function Page() {
    const testSchema = v.defineObject({
        name: Name,
        email: { vo: Email, optional: false },
        bio: {
            vo: Text,
            optional: true,
            config: { minLength: 3, maxLength: 20 },
        },
        tags: v.defineArray(Tag, { min: 2, max: 5 }),
        keywords: v.defineArray(Tag, { optional: true }),
        roles: v.defineArray(
            {
                name: Name,
                description: {
                    vo: Text,
                    optional: true,
                    config: { minLength: 3, maxLength: 20 },
                },
                permissions: v.defineArray(
                    {
                        name: Name,
                        level: { vo: Level, optional: false },
                        description: { vo: Text, optional: true },
                    },
                    { min: 1, max: 3 },
                ),
            },
            { min: 1, max: 5, optional: false },
        ),
        brand: v.defineObject({
            id: Id,
            name: Name,
            description: {
                vo: Text,
                optional: true,
            },
        }),
        tecs: v.defineArray(
            {
                name: Name,
                level: { vo: Level, optional: false },
                description: { vo: Text, optional: true },
            },
            { min: 1, max: 3 },
        ),
    });

    type TestFormData = v.infer<typeof testSchema>;

    const [logs, setLogs] = useState<string[]>([]);
    const [expandedRoles, setExpandedRoles] = useState<Set<number>>(new Set());

    const form = useForm<TestFormData>({
        resolver: v.resolver(testSchema),
        defaultValues: {
            brand: {
                id: "",
                name: "",
                description: "",
            },
            tags: [],
            keywords: [],
            roles: [],
            tecs: [],
        },
    });

    function addLog(message: string) {
        setLogs((prev) => [
            ...prev.slice(-19),
            `[${new Date().toLocaleTimeString()}] ${message}`,
        ]);
    }

    async function onSubmit(data: TestFormData) {
        console.log("Dados validados:", data);
        addLog(`✅ Sucesso: ${JSON.stringify(data, null, 2)}`);
    }

    function addTag() {
        const currentTags = form.getValues("tags") || [];
        form.setValue("tags", [...currentTags, ""]);
        addLog(`Tag adicionada. Total: ${currentTags.length + 1}`);
    }

    function removeTag(index: number) {
        const currentTags = form.getValues("tags") || [];
        const newTags = currentTags.filter((_, i) => i !== index);
        form.setValue("tags", newTags);
        addLog(`Tag removida. Total: ${newTags.length}`);
    }

    function addKeyword() {
        const currentKeywords = form.getValues("keywords") || [];
        form.setValue("keywords", [...currentKeywords, ""]);
        addLog(`Keyword adicionada. Total: ${currentKeywords.length + 1}`);
    }

    function removeKeyword(index: number) {
        const currentKeywords = form.getValues("keywords") || [];
        const newKeywords = currentKeywords.filter((_, i) => i !== index);
        form.setValue("keywords", newKeywords);
        addLog(`Keyword removida. Total: ${newKeywords.length}`);
    }

    function addTec() {
        const currentTecs = form.getValues("tecs") || [];
        form.setValue("tecs", [...currentTecs, { name: "", level: 1 }]);
        addLog(`Tec adicionada. Total: ${currentTecs.length + 1}`);
    }

    function removeTec(index: number) {
        const currentTecs = form.getValues("tecs") || [];
        const newTecs = currentTecs.filter((_, i) => i !== index);
        form.setValue("tecs", newTecs);
        addLog(`Tec removida. Total: ${newTecs.length}`);
    }

    function addRole() {
        const currentRoles = form.getValues("roles") || [];
        form.setValue("roles", [
            ...currentRoles,
            { name: "", permissions: [] },
        ]);
        const newIndex = currentRoles.length;
        setExpandedRoles((prev) => new Set([...prev, newIndex]));
        addLog(`Role adicionada. Total: ${currentRoles.length + 1}`);
    }

    function removeRole(index: number) {
        const currentRoles = form.getValues("roles") || [];
        const newRoles = currentRoles.filter((_, i) => i !== index);
        form.setValue("roles", newRoles);

        const newExpanded = new Set<number>();
        expandedRoles.forEach((idx) => {
            if (idx < index) newExpanded.add(idx);
            if (idx > index) newExpanded.add(idx - 1);
        });
        setExpandedRoles(newExpanded);
        addLog(`Role removida. Total: ${newRoles.length}`);
    }

    function addPermission(roleIndex: number) {
        const currentRoles = form.getValues("roles") || [];
        const role = currentRoles[roleIndex];
        if (!role) return;

        const currentPermissions = role.permissions || [];
        const updatedRole = {
            ...role,
            permissions: [...currentPermissions, { name: "", level: 1 }],
        };

        const newRoles = [...currentRoles];
        newRoles[roleIndex] = updatedRole;
        form.setValue("roles", newRoles);
        addLog(
            `Permission adicionada na role[${roleIndex}]. Total: ${currentPermissions.length + 1}`,
        );
    }

    function removePermission(roleIndex: number, permIndex: number) {
        const currentRoles = form.getValues("roles") || [];
        const role = currentRoles[roleIndex];
        if (!role) return;

        const currentPermissions = role.permissions || [];
        const newPermissions = currentPermissions.filter(
            (_, i) => i !== permIndex,
        );

        const updatedRole = { ...role, permissions: newPermissions };
        const newRoles = [...currentRoles];
        newRoles[roleIndex] = updatedRole;
        form.setValue("roles", newRoles);
        addLog(
            `Permission removida da role[${roleIndex}]. Total: ${newPermissions.length}`,
        );
    }

    const tagsErrors = form.formState.errors.tags;
    const keywordsErrors = form.formState.errors.keywords;
    const rolesErrors = form.formState.errors.roles;
    const tecsErrors = form.formState.errors.tecs;

    console.log(rolesErrors);

    const roles = form.getValues("roles") || [];

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">
                Teste de Arrays Recursivos no Resolver
            </h1>
            <p className="text-gray-600 mb-6">
                Este formulário demonstra todos os tipos de arrays: simples
                (VOs), objetos e objetos com arrays aninhados (recursivo).
            </p>

            <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-8">
                    <div className="border p-4 rounded-lg ">
                        <h2 className="text-lg font-semibold mb-4">
                            📝 Campos Simples (VOs diretos)
                        </h2>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome (obrigatório)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite o nome"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Email (obrigatório)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="email@exemplo.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Bio (opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Descrição opcional"
                                            {...field}
                                            value={String(field.value ?? "")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="border p-4 rounded-lg ">
                        <h2 className="text-lg font-semibold mb-4">
                            Brand (Objeto aninhado com v.defineObject)
                        </h2>

                        <FormField
                            control={form.control}
                            name="brand.id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand ID (UUID)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="00000000-0000-0000-0000-000000000000"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brand.name"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Brand Name</FormLabel>
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
                            name="brand.description"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>
                                        Brand Description (opcional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Descrição opcional da marca"
                                            {...field}
                                            value={String(field.value ?? "")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="border p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Tags (Array de VO - min: 2, max: 5)
                        </h2>

                        {(form.getValues("tags") || [])?.map(
                            (_, index: number) => (
                                <div key={index} className="flex gap-2 mt-2">
                                    <FormField
                                        control={form.control}
                                        name={`tags.${index}`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder={`Tag ${index + 1}`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTag(index)}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        Remover
                                    </button>
                                </div>
                            ),
                        )}

                        {tagsErrors?.message && (
                            <p className="text-red-500 text-sm mt-2">
                                {tagsErrors.message}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={addTag}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            + Adicionar Tag
                        </button>
                    </div>

                    <div className="border p-4 rounded-lg ">
                        <h2 className="text-lg font-semibold mb-4 ">
                            Keywords (Array de VO - opcional)
                        </h2>

                        {(form.getValues("keywords") || [])?.map(
                            (_, index: number) => (
                                <div key={index} className="flex gap-2 mt-2">
                                    <FormField
                                        control={form.control}
                                        name={`keywords.${index}`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder={`Keyword ${index + 1}`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeKeyword(index)}
                                        className="px-3 py-2 text-red-700 rounded hover:bg-red-200"
                                    >
                                        Remover
                                    </button>
                                </div>
                            ),
                        )}

                        {keywordsErrors?.message && (
                            <p className="text-red-500 text-sm mt-2">
                                {keywordsErrors.message}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={addKeyword}
                            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                            + Adicionar Keyword
                        </button>
                    </div>

                    <div className="border p-4 rounded-lg ">
                        <h2 className="text-lg font-semibold mb-4 ">
                            Tecs (Array de objetos simples - min: 1, max: 3)
                        </h2>

                        {(form.getValues("tecs") || [])?.map(
                            (_, index: number) => (
                                <div
                                    key={index}
                                    className="border p-3 rounded mt-3"
                                >
                                    <h3 className="text-sm font-medium mb-2">
                                        Tec #{index + 1}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name={`tecs.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">
                                                        Nome
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nome da tecnologia"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`tecs.${index}.level`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">
                                                        Nível (1-10)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="1-10"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    e.target
                                                                        .value
                                                                        ? Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                        : "",
                                                                )
                                                            }
                                                            value={String(
                                                                field.value ??
                                                                "",
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`tecs.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem className="mt-2">
                                                <FormLabel className="text-xs">
                                                    Descrição (opcional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Descrição opcional"
                                                        {...field}
                                                        value={String(
                                                            field.value ?? "",
                                                        )}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTec(index)}
                                        className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        Remover Tec
                                    </button>
                                </div>
                            ),
                        )}

                        <div className="flex flex-col">
                            <button
                                type="button"
                                onClick={addTec}
                                className="max-w-max mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                + Adicionar Tec
                            </button>
                            {tecsErrors?.message && (
                                <span className="text-red-500">
                                    {tecsErrors.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2 ">
                            Roles (Array de objetos com arrays aninhados -
                            RECURSIVO!)
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Cada role tem um array de permissions (min: 1, max:
                            3)
                        </p>

                        {roles?.map((role, roleIndex: number) => (
                            <div
                                key={roleIndex}
                                className="border-2 border-red-200 p-4 rounded mt-3 "
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-red-800">
                                        Role #{roleIndex + 1}:{" "}
                                        {role?.name || "(sem nome)"}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeRole(roleIndex)
                                            }
                                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                        >
                                            Remover Role
                                        </button>
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name={`roles.${roleIndex}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Role</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nome da role"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`roles.${roleIndex}.description`}
                                    render={({ field }) => (
                                        <FormItem className="mt-3">
                                            <FormLabel>
                                                Descrição (opcional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Descrição da role"
                                                    {...field}
                                                    value={String(
                                                        field.value ?? "",
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {expandedRoles.has(roleIndex) && (
                                    <div className="mt-4 p-3 rounded border">
                                        <h4 className="text-sm font-semibold mb-2 ">
                                            Permissions desta role (array
                                            aninhado):
                                        </h4>

                                        {(role?.permissions || [])?.map(
                                            (_: unknown, permIndex: number) => (
                                                <div
                                                    key={permIndex}
                                                    className="border border-blue-200 p-2 rounded mt-2 "
                                                >
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        Permission #
                                                        {permIndex + 1}
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name={`roles.${roleIndex}.permissions.${permIndex}.name`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-xs">
                                                                        Nome
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Nome da permission"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={
                                                                form.control
                                                            }
                                                            name={`roles.${roleIndex}.permissions.${permIndex}.level`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormItem>
                                                                    <FormLabel className="text-xs">
                                                                        Nível
                                                                        (1-10)
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="1-10"
                                                                            {...field}
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                field.onChange(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                        ? Number(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                        : "",
                                                                                )
                                                                            }
                                                                            value={String(
                                                                                field.value ??
                                                                                "",
                                                                            )}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <FormField
                                                        control={form.control}
                                                        name={`roles.${roleIndex}.permissions.${permIndex}.description`}
                                                        render={({ field }) => (
                                                            <FormItem className="mt-2">
                                                                <FormLabel className="text-xs">
                                                                    Descrição
                                                                    (opcional)
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Descrição"
                                                                        {...field}
                                                                        value={String(
                                                                            field.value ??
                                                                            "",
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removePermission(
                                                                roleIndex,
                                                                permIndex,
                                                            )
                                                        }
                                                        className="mt-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                                                    >
                                                        Remover Permission
                                                    </button>
                                                </div>
                                            ),
                                        )}

                                        <div className="flex flex-col">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addPermission(roleIndex)
                                                }
                                                className="mt-2 px-3 max-w-max py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                + Adicionar Permission
                                            </button>

                                            {rolesErrors && (
                                                <span className="text-red-500">
                                                    {
                                                        rolesErrors[roleIndex]
                                                            ?.permissions
                                                            ?.message
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="flex flex-col">
                            <button
                                type="button"
                                onClick={addRole}
                                className="mt-4 max-w-max px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                ➕ Adicionar Role
                            </button>
                            {rolesErrors?.message && (
                                <span className="text-red-500">
                                    {rolesErrors.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Validar e Enviar
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                form.reset({
                                    brand: {
                                        id: "",
                                        name: "",
                                        description: "",
                                    },
                                    tags: [],
                                    keywords: [],
                                    roles: [],
                                    tecs: [],
                                });
                                setExpandedRoles(new Set());
                                setLogs([]);
                            }}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Resetar
                        </button>
                    </div>
                </div>
            </Form>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border p-4 rounded-lg bg-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                        Logs
                    </h2>
                    <pre className="text-xs font-mono text-green-400 p-2 overflow-auto h-48">
                        {logs.length === 0
                            ? "Nenhum log ainda..."
                            : logs.join("\n")}
                    </pre>
                </div>

                <div className="border p-4 rounded-lg bg-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-white">
                        Erros
                    </h2>
                    <pre className="text-xs font-mono text-red-400 p-2 overflow-auto h-48">
                        {JSON.stringify(form.formState.errors, null, 2)}
                    </pre>
                </div>
            </div>

            <div className="mt-4 border p-4 rounded-lg bg-gray-900">
                <h2 className="text-lg font-semibold mb-2 text-white">
                    Valores
                </h2>
                <pre className="text-xs font-mono text-blue-400 p-2 overflow-auto h-48">
                    {JSON.stringify(form.getValues(), null, 2)}
                </pre>
            </div>
        </div>
    );
}
