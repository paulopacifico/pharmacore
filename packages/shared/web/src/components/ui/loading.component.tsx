"use client";

interface LoadingProps {
	size?: "small" | "medium" | "large" | "extralarge";
}

const sizeConfig = {
	small: {
		container: "w-8 h-8",
		border: "border-2",
		text: "text-sm",
	},
	medium: {
		container: "w-16 h-16",
		border: "border-4",
		text: "text-base",
	},
	large: {
		container: "w-24 h-24",
		border: "border-4",
		text: "text-lg",
	},
	extralarge: {
		container: "w-32 h-32",
		border: "border-8",
		text: "text-2xl",
	},
};

export function Loading({ size = "medium" }: LoadingProps) {
	const config = sizeConfig[size];

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="flex flex-col items-center gap-4">
				<div className={`relative ${config.container}`}>
					<div
						className={`absolute inset-0 ${config.border} border-indigo-200 rounded-full`}
					></div>
					<div
						className={`absolute inset-0 ${config.border} border-transparent border-t-indigo-500 rounded-full animate-spin`}
					></div>
				</div>
				<p className={`text-indigo-500 font-medium ${config.text}`}>
					Carregando...
				</p>
			</div>
		</div>
	);
}
