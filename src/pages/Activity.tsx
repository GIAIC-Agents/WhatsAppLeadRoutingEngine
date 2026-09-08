import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { GitFork, Lock, MessageSquare, XCircle, AlertCircle, Circle, Filter, RefreshCw } from "lucide-react";
import { activityEvents, agents, type ActivityEvent } from "../data/mockData";
import { ActivityRowSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";

function EventIcon({ type }: { type: ActivityEvent["type"] }) {
  const cfg = {
    assigned: { icon: <GitFork size={13} />, color: "var(--status-available)", bg: "rgba(16,185,129,0.1)" },
    retained: { icon: <Lock size={13} />, color: "var(--status-info)", bg: "rgba(59,130,246,0.1)" },
    message: { icon: <MessageSquare size={13} />, color: "var(--muted-foreground)", bg: "var(--muted)" },
    closed: { icon: <XCircle size={13} />, color: "var(--status-offline)", bg: "rgba(148,163,184,0.1)" },
    status_change: { icon: <Circle size={13} />, color: "var(--status-busy)", bg: "rgba(245,158,11,0.1)" },
  };
  const c = cfg[type];
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: c.bg, color: c.color }}>
      {c.icon}
    </div>
  );
}

function StatusPill({ status }: { status: ActivityEvent["status"] }) {
  const cfg = {
    success: { bg: "rgba(16,185,129,0.1)", color: "var(--status-available)", label: "Success" },
    failed: { bg: "rgba(239,68,68,0.1)", color: "var(--status-error)", label: "Failed" },
    pending: { bg: "rgba(245,158,11,0.1)", color: "var(--status-busy)", label: "Pending" },
  };
  const c = cfg[status];
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

type EventTypeFilter = "all" | ActivityEvent["type"];

export default function Activity() {
  const { success: toastSuccess } = useToast();
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && tableBodyRef.current) {
      gsap.fromTo(
        tableBodyRef.current.querySelectorAll("tr"),
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [loading, typeFilter, agentFilter, statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toastSuccess("Activity log refreshed");
    }, 800);
  };

  const filtered = activityEvents.filter((e) => {
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (agentFilter !== "all" && e.agentName !== agentFilter) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  const typeOptions: { key: EventTypeFilter; label: string }[] = [
    { key: "all", label: "All Events" },
    { key: "assigned", label: "Assignments" },
    { key: "retained", label: "Retained" },
    { key: "message", label: "Messages" },
    { key: "closed", label: "Closed" },
    { key: "status_change", label: "Status Changes" },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Filter size={13} style={{ color: "var(--muted-foreground)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Filters</span>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors hover:bg-[var(--muted)]"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              <motion.span animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.7, repeat: refreshing ? Infinity : 0, ease: "linear" }}>
                <RefreshCw size={12} />
              </motion.span>
              Refresh
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Event type */}
            <div className="flex flex-wrap gap-1.5">
              {typeOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setTypeFilter(opt.key)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-all"
                  style={{
                    background: typeFilter === opt.key ? "var(--primary)" : "var(--card)",
                    borderColor: typeFilter === opt.key ? "var(--primary)" : "var(--border)",
                    color: typeFilter === opt.key ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border outline-none"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="all">All Agents</option>
              {agents.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>

            <div className="flex gap-1">
              {(["all", "success", "failed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-all capitalize"
                  style={{
                    background: statusFilter === s
                      ? s === "success" ? "rgba(16,185,129,0.12)" : s === "failed" ? "rgba(239,68,68,0.12)" : "var(--primary)"
                      : "var(--card)",
                    borderColor: statusFilter === s
                      ? s === "success" ? "var(--status-available)" : s === "failed" ? "var(--status-error)" : "var(--primary)"
                      : "var(--border)",
                    color: statusFilter === s
                      ? s === "success" ? "var(--status-available)" : s === "failed" ? "var(--status-error)" : "var(--primary-foreground)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {s === "all" ? "All Status" : s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary strip */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 mb-3 px-1"
          >
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Showing <strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> of {activityEvents.length} events
            </p>
            {filtered.filter(e => e.status === "failed").length > 0 && (
              <p className="text-xs flex items-center gap-1" style={{ color: "var(--status-error)" }}>
                <AlertCircle size={11} />
                {filtered.filter(e => e.status === "failed").length} failed
              </p>
            )}
          </motion.div>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Time", "Event", "Customer", "Agent", "Method", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <ActivityRowSkeleton key={i} />)
                : filtered.map((event) => (
                  <tr
                    key={event.id}
                    className="transition-colors hover:bg-[var(--muted)]"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>{event.timestamp}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <EventIcon type={event.type} />
                        <span className="text-xs" style={{ color: "var(--foreground)" }}>{event.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {event.customerPhone
                        ? <span className="phone-mono" style={{ color: "var(--foreground)" }}>{event.customerPhone}</span>
                        : <span style={{ color: "var(--muted-foreground)" }}>—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {event.agentName
                        ? <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{event.agentName}</span>
                        : <span className="text-xs" style={{ color: "var(--status-error)" }}>No agent</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {event.method && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                          {event.method}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5"><StatusPill status={event.status} /></td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <AlertCircle size={24} style={{ color: "var(--muted-foreground)" }} />
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No events match your filters</p>
              <button onClick={() => { setTypeFilter("all"); setAgentFilter("all"); setStatusFilter("all"); }} className="text-xs underline" style={{ color: "var(--accent)" }}>
                Clear filters
              </button>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
          Connect your WhatsApp integration to see live routing activity
        </p>
      </div>
    </div>
  );
}
