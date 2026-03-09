export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background flex animate-pulse">
      <div className="w-64 bg-[#1B2035] border-r border-[#4A5680] p-4 hidden md:block">
        <div className="h-8 w-32 bg-[#2B3150] rounded-lg mb-8"></div>

        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="h-5 w-5 bg-[#2B3150]/50 rounded"></div>
              <div className="h-4 flex-1 bg-[#2B3150]/30 rounded"></div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 w-56">
          <div className="flex items-center gap-3 p-3">
            <div className="h-10 w-10 bg-[#2B3150] rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-[#2B3150]/50 rounded"></div>
              <div className="h-3 w-16 bg-[#2B3150]/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-[#1B2035] border-b border-[#4A5680] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 bg-[#2B3150] rounded md:hidden"></div>
            <div className="h-6 w-48 bg-[#2B3150] rounded-lg"></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-[#2B3150] rounded-full"></div>
            <div className="h-8 w-8 bg-[#2B3150] rounded-full"></div>
            <div className="h-10 w-32 bg-[#2B3150]/50 rounded-lg hidden md:block"></div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-3 w-16 bg-[#2B3150]/30 rounded"></div>
            <div className="h-3 w-3 bg-[#2B3150]/30 rounded"></div>
            <div className="h-3 w-24 bg-[#2B3150]/50 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="h-32 bg-[#262D4A] rounded-2xl p-4">
              <div className="h-5 w-32 bg-[#323A5E] rounded mb-4"></div>
              <div className="h-8 w-24 bg-[#2B3150] rounded mb-2"></div>
              <div className="h-3 w-40 bg-[#2B3150]/30 rounded"></div>
            </div>
            <div className="h-32 bg-[#262D4A] rounded-2xl p-4">
              <div className="h-5 w-32 bg-[#323A5E] rounded mb-4"></div>
              <div className="h-8 w-24 bg-[#2B3150] rounded mb-2"></div>
              <div className="h-3 w-40 bg-[#2B3150]/30 rounded"></div>
            </div>
            <div className="h-32 bg-[#262D4A] rounded-2xl p-4">
              <div className="h-5 w-32 bg-[#323A5E] rounded mb-4"></div>
              <div className="h-8 w-24 bg-[#2B3150] rounded mb-2"></div>
              <div className="h-3 w-40 bg-[#2B3150]/30 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="h-5 w-40 bg-[#323A5E] rounded mb-2"></div>
              <div className="h-48 bg-[#262D4A] rounded-2xl"></div>
            </div>

            <div className="space-y-4">
              <div className="h-5 w-40 bg-[#323A5E] rounded mb-2"></div>
              <div className="h-48 bg-[#262D4A] rounded-2xl"></div>
            </div>
          </div>

          <div className="bg-[#262D4A] rounded-2xl p-4">
            <div className="h-6 w-48 bg-[#323A5E] rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-[#2B3150]/30 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>

        <footer className="h-12 bg-[#1B2035] border-t border-[#4A5680] px-6 flex items-center justify-between">
          <div className="h-3 w-32 bg-[#2B3150]/30 rounded"></div>
          <div className="flex items-center gap-4">
            <div className="h-3 w-20 bg-[#2B3150]/30 rounded"></div>
            <div className="h-3 w-20 bg-[#2B3150]/30 rounded"></div>
            <div className="h-3 w-20 bg-[#2B3150]/30 rounded"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
