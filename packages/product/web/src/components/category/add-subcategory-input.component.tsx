"use client";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Input } from "@pharmacore/shared-web";
import { toast } from "sonner";

interface AddSubcategoryInputProps {
	onAddSubcategory: (name: string) => void;
}

export function AddSubcategoryInput({
	onAddSubcategory,
}: AddSubcategoryInputProps) {
	const [newSubcategoryName, setNewSubcategoryName] = useState("");

	const handleAddSubcategory = () => {
		if (!newSubcategoryName.trim()) {
			toast.error("Nome da subcategoria não pode estar vazio");
			return;
		}
		onAddSubcategory(newSubcategoryName.trim());
		setNewSubcategoryName("");
	};

	return (
		<div className="space-y-2">
			<h4 className="text-sm font-medium text-gray-300">
				Adicionar nova subcategoria:
			</h4>
			<div className="flex gap-2">
				<Input
					type="text"
					placeholder="Nome da subcategoria"
					value={newSubcategoryName}
					onChange={(e) => setNewSubcategoryName(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleAddSubcategory();
						}
					}}
					className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
				/>
				<button
					type="button"
					onClick={handleAddSubcategory}
					className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
				>
					<PlusIcon className="h-4 w-4" />
					Adicionar
				</button>
			</div>
		</div>
	);
}
