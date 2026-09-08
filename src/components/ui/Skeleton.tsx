export function Skeleton({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-xl border p-5 space-y-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-12 h-4 rounded" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="w-20 h-7 rounded" />
        <Skeleton className="w-32 h-3.5 rounded" />
        <Skeleton className="w-24 h-3 rounded" />
      </div>
    </div>
  );
}

export function ConversationRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex-1 space-y-1.5">
        <Skeleton className="w-36 h-3.5 rounded" />
        <Skeleton className="w-52 h-3 rounded" />
      </div>
      <Skeleton className="w-16 h-3 rounded" />
      <Skeleton className="w-14 h-5 rounded-full" />
      <Skeleton className="w-8 h-3 rounded" />
    </div>
  );
}

export function AgentRowSkeleton() {
  return (
    <tr>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="w-28 h-3.5 rounded" />
            <Skeleton className="w-24 h-3 rounded" />
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5"><Skeleton className="w-20 h-6 rounded-lg" /></td>
      <td className="px-5 py-3.5"><Skeleton className="w-12 h-4 rounded" /></td>
      <td className="px-5 py-3.5"><Skeleton className="w-16 h-4 rounded" /></td>
      <td className="px-5 py-3.5"><Skeleton className="w-20 h-4 rounded" /></td>
      <td className="px-5 py-3.5"><Skeleton className="w-6 h-6 rounded" /></td>
    </tr>
  );
}

export function ActivityRowSkeleton() {
  return (
    <tr>
      <td className="px-5 py-3.5"><Skeleton className="w-14 h-3.5 rounded" /></td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-44 h-3.5 rounded" />
        </div>
      </td>
      <td className="px-5 py-3.5"><Skeleton className="w-28 h-3.5 rounded" /></td>
      <td className="px-5 py-3.5"><Skeleton className="w-24 h-3.5 rounded" /></td>
      <td className="px-5 py-3.5"><Skeleton className="w-20 h-5 rounded" /></td>
      <td className="px-5 py-3.5"><Skeleton className="w-16 h-5 rounded-full" /></td>
    </tr>
  );
}

export function MessageSkeleton({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className="space-y-1.5 max-w-[60%]">
        <Skeleton className="w-full h-14 rounded-xl" />
        <Skeleton className="w-16 h-2.5 rounded" style={{ marginLeft: align === "right" ? "auto" : 0 }} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border p-5 space-y-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <Skeleton className="w-32 h-4 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="w-16 h-3 rounded" />
                  <Skeleton className="w-4 h-3 rounded" />
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 rounded-xl border p-5 space-y-2" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <Skeleton className="w-28 h-4 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                <Skeleton className="w-5 h-5 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="w-40 h-3 rounded" />
                  <Skeleton className="w-28 h-2.5 rounded" />
                </div>
                <Skeleton className="w-16 h-3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
