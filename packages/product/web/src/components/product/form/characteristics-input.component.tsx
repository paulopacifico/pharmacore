"use client";

import { useState } from "react";
import { PlusIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { FormMessage, Input } from "@pharmacore/shared-web";

interface CharacteristicItem {
    name: string;
    value: string;
}

interface CharacteristicsInputProps {
    characteristics: CharacteristicItem[];
    errors: any;
    onCharacteristicsChange: (characteristics: CharacteristicItem[]) => void;
}

export function CharacteristicsInput({
    characteristics,
    errors,
    onCharacteristicsChange,
}: CharacteristicsInputProps) {
    const [newCharacteristicName, setNewCharacteristicName] = useState("");
    const [newCharacteristicValue, setNewCharacteristicValue] = useState("");

    const addCharacteristic = () => {
        if (newCharacteristicName.trim() && newCharacteristicValue.trim()) {
            onCharacteristicsChange([
                ...characteristics,
                {
                    name: newCharacteristicName.trim(),
                    value: newCharacteristicValue.trim(),
                },
            ]);
            setNewCharacteristicName("");
            setNewCharacteristicValue("");
        }
    };

    const removeCharacteristic = (index: number) => {
        onCharacteristicsChange(characteristics.filter((_, i) => i !== index));
    };

    const updateCharacteristic = (
        index: number,
        updatedCharacteristic: { name?: string; value?: string },
    ) => {
        const updated = characteristics.map((char, idx) =>
            idx === index ? { ...char, ...updatedCharacteristic } : char,
        );
        onCharacteristicsChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {characteristics.map((characteristic, index) => (
                    <div
                        key={index}
                        className="space-y-2 border-b pb-4 border-gray-200 dark:border-gray-700"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs font-medium text-gray-400 mb-1 block">
                                    Nome
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Ex: Cor, Tamanho, Ativo"
                                    value={characteristic.name}
                                    onChange={(e) =>
                                        updateCharacteristic(index, {
                                            name: e.target.value,
                                        })
                                    }
                                    className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">
                                        Valor
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Ex: Azul, P, Sim"
                                        value={characteristic.value}
                                        onChange={(e) =>
                                            updateCharacteristic(index, {
                                                value: e.target.value,
                                            })
                                        }
                                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                {characteristics.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeCharacteristic(index)
                                        }
                                        className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                        title="Remover característica"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        {(errors?.[index]?.name?.message ||
                            errors?.[index]?.value?.message) && (
                            <div className="space-y-1">
                                {errors?.[index]?.name?.message && (
                                    <FormMessage>
                                        Nome: {errors[index].name.message}
                                    </FormMessage>
                                )}
                                {errors?.[index]?.value?.message && (
                                    <FormMessage>
                                        Valor: {errors[index].value.message}
                                    </FormMessage>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                <p className="text-sm font-medium text-gray-300">
                    Adicionar Nova Característica
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">
                            Nome
                        </label>
                        <Input
                            type="text"
                            placeholder="Ex: Cor, Tamanho, Ativo"
                            value={newCharacteristicName}
                            onChange={(e) =>
                                setNewCharacteristicName(e.target.value)
                            }
                            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-400 mb-1 block">
                                Valor
                            </label>
                            <Input
                                type="text"
                                placeholder="Ex: Azul, P, Sim"
                                value={newCharacteristicValue}
                                onChange={(e) =>
                                    setNewCharacteristicValue(e.target.value)
                                }
                                className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addCharacteristic}
                            disabled={
                                !newCharacteristicName.trim() ||
                                !newCharacteristicValue.trim()
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Adicionar característica"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
