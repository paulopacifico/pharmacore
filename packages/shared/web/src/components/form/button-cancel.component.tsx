import { classNames } from "@pharmacore/shared-web";

interface ButtonCancelProps {
	className?: string;
	children: React.ReactNode;
	callback: () => void;
}

export function ButtonCancel({
	className,
	callback,
	children,
}: ButtonCancelProps) {
	return (
		<button
			className={classNames(
				"group inline-flex items-center justify-center gap-2 rounded-[10px] border border-border-input bg-bg-input px-3.5 py-2.5 text-xs font-semibold text-text-secondary transition-all hover:bg-bg-card-hover focus:outline-none focus:ring-2 focus:ring-accent-blue",
				className,
			)}
			onClick={(e) => {
				e.preventDefault();
				callback();
			}}
		>
			{children}
		</button>
	);
}
