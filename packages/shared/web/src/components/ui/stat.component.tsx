import type { ElementType } from "react";

export interface StatProps {
	name: string;
	stat: string | number;
	icon: ElementType;
}

export function Stat({ name, stat, icon: Icon }: StatProps) {
	return (
		<div className="relative overflow-hidden rounded-lg bg-gray-800/75 px-4 p-6 shadow-sm inset-ring inset-ring-white/10 sm:px-6 sm:pt-6">
			<dt>
				<div className="absolute rounded-md bg-indigo-500 p-3">
					<Icon aria-hidden="true" className="size-7 text-white" />
				</div>
				<p className="ml-16 truncate text-sm font-medium text-gray-400">
					{name}
				</p>
			</dt>
			<div className="ml-16 flex items-baseline ">
				<p className="text-2xl font-semibold text-white">{stat}</p>
			</div>
		</div>
	);
}
