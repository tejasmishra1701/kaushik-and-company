export default function AdminDashboardLoading() {
  return (
    <div className="min-h-full px-8 py-10 animate-pulse">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-1 h-3 w-16 rounded bg-[#1e1e1e]" />
        <div className="mt-2 h-8 w-36 rounded bg-[#1e1e1e]" />
        <div className="mt-3 h-[1px] w-10 bg-[#2a2a2a]" />
      </div>

      {/* Stat cards skeleton */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border border-[#1e1e1e] bg-[#111111] p-6">
            <div className="h-3 w-24 rounded bg-[#1e1e1e]" />
            <div className="mt-3 h-10 w-16 rounded bg-[#1e1e1e]" />
          </div>
        ))}
      </div>

      {/* Recent cases skeleton */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="h-3 w-28 rounded bg-[#1e1e1e]" />
          <div className="h-3 w-16 rounded bg-[#1e1e1e]" />
        </div>
        <div className="divide-y divide-[#1e1e1e] border border-[#1e1e1e]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="space-y-1.5">
                <div className="h-3.5 w-48 rounded bg-[#1e1e1e]" />
                <div className="h-3 w-28 rounded bg-[#1a1a1a]" />
              </div>
              <div className="h-5 w-14 rounded bg-[#1e1e1e]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
