export default function ClientsLoading() {
  return (
    <div className="min-h-full px-8 py-10 animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-1 h-3 w-24 rounded bg-[#1e1e1e]" />
          <div className="mt-2 h-8 w-32 rounded bg-[#1e1e1e]" />
          <div className="mt-3 h-[1px] w-10 bg-[#2a2a2a]" />
        </div>
        <div className="h-9 w-28 rounded bg-[#1e1e1e]" />
      </div>

      {/* Table skeleton */}
      <div className="border border-[#1e1e1e]">
        {/* Table header */}
        <div className="grid grid-cols-4 border-b border-[#1e1e1e] bg-[#0d0d0d] px-6 py-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 w-16 rounded bg-[#1e1e1e]" />
          ))}
        </div>
        {/* Table rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center border-b border-[#1a1a1a] px-6 py-4 gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#1e1e1e]" />
              <div className="h-3.5 w-28 rounded bg-[#1e1e1e]" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-32 rounded bg-[#1e1e1e]" />
              <div className="h-3 w-24 rounded bg-[#1a1a1a]" />
            </div>
            <div className="h-3 w-20 rounded bg-[#1e1e1e]" />
            <div className="flex justify-end gap-2">
              <div className="h-7 w-7 rounded bg-[#1e1e1e]" />
              <div className="h-7 w-7 rounded bg-[#1e1e1e]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
