export function TableSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="h-8 w-48 bg-[#2f3349] rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-[#272b3e] rounded animate-pulse"></div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="h-10 bg-[#272b3e] rounded-[10px] animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-[#272b3e] rounded-[10px] animate-pulse"></div>
          <div className="h-10 w-32 bg-[#272b3e] rounded-[10px] animate-pulse"></div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#404560]">
        <div className="bg-[#2f3349]">
          <div className="grid grid-cols-4 gap-4 p-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-[#404560] rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#404560]">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className={`grid grid-cols-4 gap-4 p-4 ${rowIndex % 2 === 0 ? "bg-[#272b40]" : "bg-[#242840]"}`}>
              {[...Array(4)].map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-[#2f3349] rounded animate-pulse"
                  style={{
                    animationDelay: `${rowIndex * 100}ms`,
                    animationDuration: "1.5s",
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-[#252840] border-t border-[#404560] p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="h-4 w-48 bg-[#2f3349] rounded animate-pulse"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 bg-[#272b3e] rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
