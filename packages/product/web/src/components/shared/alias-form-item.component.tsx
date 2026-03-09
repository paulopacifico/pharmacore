"use client";
import { useEffect, useState } from "react";
import {
    PencilIcon,
    LockClosedIcon,
    LockOpenIcon,
} from "@heroicons/react/24/outline";
import {
    FormControl,
    FormItem,
    FormLabel,
    Input,
    FormMessage,
} from "@pharmacore/shared-web";
import { Alias } from "@pharmacore/shared";

interface AliasInputProps {
    value: string;
    name: string;
    onChange: (value: string) => void;
    error?: string;
}

export function AliasFormItem({
    name,
    value,
    onChange,
    error,
}: AliasInputProps) {
    const [isEditable, setIsEditable] = useState(false);
    const [wasManuallyEdited, setWasManuallyEdited] = useState(false);

    useEffect(() => {
        const shouldGenerateAlias = !isEditable && !wasManuallyEdited && name;

        if (!shouldGenerateAlias) {
            return;
        }

        const generatedAlias = Alias.fromText(name).value;
        onChange(generatedAlias);
        setWasManuallyEdited(false);
    }, [name, isEditable, onChange, wasManuallyEdited]);

    const handleToggleEditable = () => {
        setIsEditable(!isEditable);
    };

    const handleAliasChange = (newValue: string) => {
        onChange(newValue);
        if (isEditable) {
            setWasManuallyEdited(true);
        }
    };

    return (
        <FormItem>
            <FormLabel className="flex items-center gap-2">
                <PencilIcon className="h-4 w-4 text-gray-400" />
                Alias
            </FormLabel>

            <FormControl>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder={"Ex: camisa-azul-gola-v"}
                        value={value}
                        onChange={(e) => handleAliasChange(e.target.value)}
                        disabled={!isEditable}
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="button"
                        onClick={handleToggleEditable}
                        className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                            isEditable ? "Bloquear edição" : "Permitir edição"
                        }
                    >
                        {isEditable ? (
                            <LockOpenIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                            <LockClosedIcon className="h-4 w-4 text-gray-400" />
                        )}
                    </button>
                </div>
            </FormControl>
            {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
    );
}
