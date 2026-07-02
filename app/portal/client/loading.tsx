export default function ClientDashboardLoading() {
  return (
    <div className="min-h-full px-8 py-10 animate-pulse">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-1 h-3 w-16 rounded bg-[#1e1e1e]" />
        <div className="mt-2 h-8 w-28 rounded bg-[#1e1e1e]" />
        <div className="mt-3 h-[1px] w-10 bg-[#2a2a2a]" />
      </div>

      {/* Cases table skeleton */}
      <div className="border border-[#1e1e1e]">
        {/* Table header */}
        <div className="grid grid-cols-3 border-b border-[#1e1e1e] bg-[#0d0d0d] px-6 py-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 w-20 rounded bg-[#1e1e1e]" />
          ))}
        </div>
        {/* Rows */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center border-b border-[#1a1a1a] px-6 py-4 gap-4"
          >
            <div className="h-3.5 w-40 rounded bg-[#1e1e1e]" />
            <div className="h-3 w-28 rounded bg-[#1e1e1e]" />
            <div className="h-5 w-14 rounded bg-[#1e1e1e]" />
          </div>
        ))}
      </div>
    </div>
  );
}
