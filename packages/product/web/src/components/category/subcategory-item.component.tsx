"use client";
import { useState } from "react";
import {
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    PencilIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    LockClosedIcon,
    LockOpenIcon,
} from "@heroicons/react/24/outline";
import {
    FormControl,
    FormItem,
    FormLabel,
    Input,
} from "@pharmacore/shared-web";
import { Alias } from "@pharmacore/shared";
import { AliasFormItem } from "../shared";
interface SubcategoryItemProps {
    name: string;
    alias: string;
    index: number;
    isFirst?: boolean;
    isLast?: boolean;
    onUpdate: (data: { name?: string; alias?: string }) => void;
    onRemove: (name: string) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
}

export function SubcategoryItem({
    name,
    alias,
    index,
    isFirst,
    isLast,
    onUpdate,
    onRemove,
    onMoveUp,
    onMoveDown,
}: SubcategoryItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedAlias, setEditedAlias] = useState(alias);

    const handleSave = () => {
        if (!editedName.trim()) {
            return;
        }
        onUpdate({
            name: editedName.trim(),
            alias: editedAlias.trim(),
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(name);
        setEditedAlias(alias);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="space-y-3 bg-gray-800 p-3 rounded-lg border border-indigo-500">
                <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        <PencilIcon className="h-4 w-4 text-gray-400" />
                        Nome
                    </FormLabel>

                    <FormControl>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Nome da subcategoria"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </FormControl>
                </FormItem>

                <AliasFormItem
                    name={editedName}
                    value={editedAlias}
                    onChange={setEditedAlias}
                />

                <div className="flex items-center gap-2 justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Salvar"
                    >
                        <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        title="Cancelar"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                        {name}
                    </div>
                    <div className="text-xs text-gray-400">
                        Alias: {alias || "Não definido"}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onMoveUp(index)}
                        disabled={isFirst}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Mover para cima"
                    >
                        <ArrowUpIcon className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onMoveDown(index)}
                        disabled={isLast}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Mover para baixo"
                    >
                        <ArrowDownIcon className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        title="Editar"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onRemove(name)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Deletar"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
