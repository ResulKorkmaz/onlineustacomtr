export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border bg-white p-6">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

