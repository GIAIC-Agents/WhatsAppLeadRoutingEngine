import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  MessageSquare,
  AlertCircle,
  Users,
  Inbox,
  ArrowUpRight,
  ArrowDownRight,
  GitFork,
  Lock,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { agents, conversations, activityEvents, kpiData, getAgentName } from "../data/mockData";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

/* Animated counter using GSAP */
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.2,
      onUpdate() {
        if (ref.current) {
          ref.current.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
        }
      },
    });
    return () => { tween.kill(); };
  }, [value, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function KPICard({
  title,
  value,
  rawValue,
  sub,
  icon,
  accent,
  change,
  changeLabel,
  urgent,
}: {
  title: string;
  value: string;
  rawValue?: number;
  sub?: string;
  icon: React.ReactNode;
  accent?: string;
  change?: number;
  changeLabel?: string;
  urgent?: boolean;
}) {
  const isPositive = change !== undefined && change >= 0;
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{
        background: "var(--card)",
        borderColor: urgent ? "rgba(239,68,68,0.35)" : "var(--border)",
        boxShadow: urgent ? "0 0 0 1px rgba(239,68,68,0.12)" : "none",
      }}
    >
      {urgent && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "var(--status-error)" }}
        />
      )}
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: accent ? `${accent}16` : "var(--muted)" }}
        >
          <span style={{ color: accent || "var(--muted-foreground)" }}>{icon}</span>
        </div>
        {change !== undefined && (
          <span
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: isPositive ? "var(--status-available)" : "var(--status-error)" }}
          >
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </span>
        )}
        {urgent && (
          <AlertTriangle size={14} style={{ color: "var(--status-error)" }} />
        )}
      </div>
      <div>
        <p
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
        >
          {rawValue !== undefined ? <AnimatedNumber value={rawValue} /> : value}
        </p>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          {title}
        </p>
        {sub && (
          <p className="text-xs mt-1 font-medium" style={{ color: urgent ? "var(--status-error)" : accent || "var(--muted-foreground)" }}>
            {sub}
          </p>
        )}
        {changeLabel && (
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            {changeLabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function AgentStatusBadge({ status }: { status: "available" | "busy" | "offline" }) {
  const config = {
    available: { color: "var(--status-available)", bg: "rgba(16,185,129,0.1)", label: "Available" },
    busy: { color: "var(--status-busy)", bg: "rgba(245,158,11,0.1)", label: "Busy" },
    offline: { color: "var(--status-offline)", bg: "rgba(148,163,184,0.1)", label: "Offline" },
  };
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  );
}

function ConversationStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; label: string }> = {
    active: { color: "var(--status-available)", bg: "rgba(16,185,129,0.1)", label: "Active" },
    unassigned: { color: "var(--status-error)", bg: "rgba(239,68,68,0.1)", label: "Unassigned" },
    closed: { color: "var(--status-offline)", bg: "rgba(148,163,184,0.1)", label: "Closed" },
  };
  const c = config[status] || config.closed;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { success } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const available = agents.filter((a) => a.status === "available").length;
  const busy = agents.filter((a) => a.status === "busy").length;
  const offline = agents.filter((a) => a.status === "offline").length;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  /* GSAP stagger entrance for the header */
  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll(".gsap-stagger"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power3.out", delay: 0.05 }
      );
    }
  }, [loading]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      success("Dashboard refreshed", "Data is up to date");
    }, 1200);
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Page actions */}
        <div ref={headerRef} className="flex items-center justify-end gap-2 mb-5">
          <button
            onClick={handleRefresh}
            className="gsap-stagger flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
          >
            <motion.span animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.8, repeat: refreshing ? Infinity : 0, ease: "linear" }}>
              <RefreshCw size={12} />
            </motion.span>
            Refresh
          </button>
          <select
            className="gsap-stagger px-3 py-1.5 rounded-lg text-xs border outline-none"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
          {/* KPI Cards */}
          <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Active Conversations"
              value="124"
              rawValue={kpiData.activeConversations}
              icon={<MessageSquare size={18} />}
              accent="var(--accent)"
              change={kpiData.activeChange}
              changeLabel="vs last period"
            />
            <KPICard
              title="Unassigned"
              value={String(kpiData.unassigned)}
              rawValue={kpiData.unassigned}
              sub="Waiting for an agent"
              icon={<AlertCircle size={18} />}
              accent="var(--status-error)"
              urgent
            />
            <KPICard
              title="Available Agents"
              value={`${kpiData.availableAgents} / ${kpiData.totalAgents}`}
              sub={`${busy} busy · ${offline} offline`}
              icon={<Users size={18} />}
              accent="var(--accent)"
            />
            <KPICard
              title="Messages Today"
              value="1,284"
              rawValue={kpiData.messagesToday}
              icon={<Inbox size={18} />}
              change={kpiData.messagesChange}
              changeLabel="vs yesterday"
            />
          </motion.div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Agent availability */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl border p-5"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Agent Availability</h2>
                <button onClick={() => navigate("/agents")} className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                  Manage <ChevronRight size={12} />
                </button>
              </div>

              <div className="space-y-2.5 mb-5">
                {[
                  { label: "Available", count: available, color: "var(--status-available)" },
                  { label: "Busy", count: busy, color: "var(--status-busy)" },
                  { label: "Offline", count: offline, color: "var(--status-offline)" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
                        <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{s.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(s.count / agents.length) * 100}%` }}
                          transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: s.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2" style={{ borderColor: "var(--border)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
                  Top agents
                </p>
                {agents.slice(0, 5).map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                      >
                        {agent.initials}
                      </div>
                      <span className="text-xs" style={{ color: "var(--foreground)" }}>{agent.name}</span>
                    </div>
                    <AgentStatusBadge status={agent.status} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Routing activity */}
            <motion.div
              variants={fadeUp}
              className="lg:col-span-2 rounded-xl border p-5"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Routing Activity</h2>
                <button onClick={() => navigate("/activity")} className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-0">
                {activityEvents.slice(0, 6).map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 py-2.5 border-b last:border-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                      style={{
                        background: event.type === "retained"
                          ? "rgba(59,130,246,0.12)"
                          : event.status === "failed"
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(16,185,129,0.1)",
                        color: event.type === "retained"
                          ? "var(--status-info)"
                          : event.status === "failed"
                          ? "var(--status-error)"
                          : "var(--status-available)",
                      }}
                    >
                      {event.type === "retained" ? <Lock size={11} /> : <GitFork size={11} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ color: "var(--foreground)" }}>{event.description}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {event.customerPhone && (
                          <span className="phone-mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                            {event.customerPhone}
                          </span>
                        )}
                        {event.agentName && (
                          <>
                            <span style={{ color: "var(--border)" }}>·</span>
                            <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>{event.agentName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{event.timestamp}</span>
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: event.status === "success" ? "var(--status-available)" : "var(--status-error)" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent conversations */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Recent Conversations</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {conversations.filter(c => c.status === "unassigned").length > 0 && (
                    <span style={{ color: "var(--status-error)" }}>
                      {conversations.filter(c => c.status === "unassigned").length} unassigned ·{" "}
                    </span>
                  )}
                  {conversations.filter(c => c.status === "active").length} active
                </p>
              </div>
              <button onClick={() => navigate("/conversations")} className="flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                Open inbox <ChevronRight size={12} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Customer", "Last Message", "Agent", "Status", "Updated"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {conversations.slice(0, 6).map((conv, i) => {
                    const agentName = getAgentName(conv.assignedAgentId);
                    return (
                      <motion.tr
                        key={conv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.04 * i }}
                        onClick={() => navigate("/conversations")}
                        className="cursor-pointer transition-colors hover:bg-[var(--muted)]"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            {conv.unreadCount > 0 && (
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                            )}
                            <div>
                              {conv.customerName && (
                                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{conv.customerName}</p>
                              )}
                              <p className="phone-mono" style={{ color: conv.customerName ? "var(--muted-foreground)" : "var(--foreground)" }}>
                                {conv.customerPhone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 max-w-[200px]">
                          <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                            "{conv.lastMessage}"
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          {agentName ? (
                            <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{agentName}</span>
                          ) : (
                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--status-error)" }}>
                              <AlertCircle size={11} /> Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5"><ConversationStatusBadge status={conv.status} /></td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{conv.lastMessageTime}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
