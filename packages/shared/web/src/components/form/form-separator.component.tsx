export function FormSeparator({ lable }: { lable: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="h-0.5 flex-1 bg-gray-700/50"></div>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {lable}
      </span>
      <div className="h-0.5 flex-1 bg-gray-700/50"></div>
    </div>
  );
}
