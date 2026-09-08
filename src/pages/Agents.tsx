import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { Plus, Search, MoreHorizontal, X, ChevronDown, CheckCircle, AlertCircle, UserCheck } from "lucide-react";
import { agents as initialAgents, type Agent, type AgentStatus } from "../data/mockData";
import { AgentRowSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";

function StatusBadge({ status }: { status: AgentStatus }) {
  const cfg = {
    available: { color: "var(--status-available)", bg: "rgba(16,185,129,0.1)", label: "Available" },
    busy: { color: "var(--status-busy)", bg: "rgba(245,158,11,0.1)", label: "Busy" },
    offline: { color: "var(--status-offline)", bg: "rgba(148,163,184,0.1)", label: "Offline" },
  };
  const c = cfg[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  );
}

function StatusSelector({ value, onChange }: { value: AgentStatus; onChange: (v: AgentStatus) => void }) {
  const [open, setOpen] = useState(false);
  const cfg = {
    available: { color: "var(--status-available)", label: "Available" },
    busy: { color: "var(--status-busy)", label: "Busy" },
    offline: { color: "var(--status-offline)", label: "Offline" },
  };
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-[var(--muted)]"
        style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg[value].color }} />
        <span>{cfg[value].label}</span>
        <ChevronDown size={11} style={{ color: "var(--muted-foreground)" }} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute left-0 top-full mt-1 z-20 rounded-xl border shadow-lg overflow-hidden"
              style={{ background: "var(--card)", borderColor: "var(--border)", minWidth: 130, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            >
              {(["available", "busy", "offline"] as AgentStatus[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors hover:bg-[var(--muted)]"
                  style={{ color: "var(--foreground)", background: value === opt ? "var(--muted)" : "transparent" }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: cfg[opt].color }} />
                  {cfg[opt].label}
                  {value === opt && <CheckCircle size={11} className="ml-auto" style={{ color: "var(--accent)" }} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddAgentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (a: Agent) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", status: "available" as AgentStatus });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?\d[\d\s\-]{7,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number (e.g. +92 300 1234567)";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    setTimeout(() => {
      const newAgent: Agent = {
        id: `a${Date.now()}`,
        name: form.name.trim(),
        phone: form.phone.trim(),
        status: form.status,
        activeConversations: 0,
        lastAssignment: null,
        createdAt: new Date().toISOString().split("T")[0],
        initials: form.name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      };
      onAdd(newAgent);
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => onClose(), 1400);
    }, 700);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[calc(100vw-32px)] rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.1)" }}>
              <UserCheck size={14} style={{ color: "var(--accent)" }} />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Add Agent</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--muted)]">
            <X size={15} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              >
                <CheckCircle size={40} style={{ color: "var(--status-available)" }} />
              </motion.div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Agent created successfully</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{form.name} has been added to your team</p>
            </motion.div>
          ) : (
            <motion.div key="form" className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--foreground)" }}>
                  Full Name <span style={{ color: "var(--status-error)" }}>*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                  placeholder="Ahmed Khan"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-colors"
                  style={{
                    background: "var(--background)",
                    borderColor: errors.name ? "var(--status-error)" : "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                {errors.name && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--status-error)" }}>
                    <AlertCircle size={10} />{errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--foreground)" }}>
                  Phone Number <span style={{ color: "var(--status-error)" }}>*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-colors font-mono"
                  style={{
                    background: "var(--background)",
                    borderColor: errors.phone ? "var(--status-error)" : "var(--border)",
                    color: "var(--foreground)",
                    letterSpacing: "0.01em",
                  }}
                />
                {errors.phone && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--status-error)" }}>
                    <AlertCircle size={10} />{errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--foreground)" }}>Initial Availability</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["available", "busy", "offline"] as AgentStatus[]).map((s) => {
                    const colors = {
                      available: "var(--status-available)",
                      busy: "var(--status-busy)",
                      offline: "var(--status-offline)",
                    };
                    return (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, status: s })}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all capitalize text-xs font-medium"
                        style={{
                          borderColor: form.status === s ? colors[s] : "var(--border)",
                          background: form.status === s ? `${colors[s]}12` : "transparent",
                          color: form.status === s ? colors[s] : "var(--muted-foreground)",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[s] }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!success && (
          <div className="flex gap-2.5 px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--muted)]"
              style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              style={{ background: submitting ? "rgba(16,185,129,0.7)" : "var(--accent)", color: "white" }}
            >
              {submitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                />
              ) : "Create Agent"}
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default function Agents() {
  const { success: toastSuccess, info: toastInfo } = useToast();
  const [agentList, setAgentList] = useState<Agent[]>(initialAgents);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && tableRef.current) {
      gsap.fromTo(
        tableRef.current.querySelectorAll("tr"),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [loading]);

  const filtered = agentList.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, newStatus: AgentStatus) => {
    const agent = agentList.find((a) => a.id === id);
    setAgentList((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    if (agent) toastInfo(`${agent.name} is now ${newStatus}`);
  };

  const availableCount = agentList.filter((a) => a.status === "available").length;
  const busyCount = agentList.filter((a) => a.status === "busy").length;
  const offlineCount = agentList.filter((a) => a.status === "offline").length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: "Available", count: availableCount, color: "var(--status-available)" },
            { label: "Busy", count: busyCount, color: "var(--status-busy)" },
            { label: "Offline", count: offlineCount, color: "var(--status-offline)" },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setStatusFilter(statusFilter === s.label.toLowerCase() as AgentStatus ? "all" : s.label.toLowerCase() as AgentStatus)}
              className="rounded-xl border p-4 text-left transition-all hover:shadow-sm"
              style={{
                background: statusFilter === s.label.toLowerCase() ? `${s.color}0C` : "var(--card)",
                borderColor: statusFilter === s.label.toLowerCase() ? s.color : "var(--border)",
              }}
            >
              <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                {s.count}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{s.label}</span>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <Search size={14} style={{ color: "var(--muted-foreground)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              className="flex-1 text-sm bg-transparent outline-none"
              style={{ color: "var(--foreground)" }}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={13} style={{ color: "var(--muted-foreground)" }} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <Plus size={14} />
            Add Agent
          </button>
        </div>

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
                {["Agent", "Status", "Active Convs", "Last Assignment", "Created", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={tableRef}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <AgentRowSkeleton key={i} />)
                : filtered.map((agent) => (
                  <tr
                    key={agent.id}
                    className="transition-colors hover:bg-[var(--muted)]"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                        >
                          {agent.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{agent.name}</p>
                          <p className="phone-mono" style={{ color: "var(--muted-foreground)" }}>{agent.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusSelector value={agent.status} onChange={(v) => updateStatus(agent.id, v)} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{agent.activeConversations}</span>
                      <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>active</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{agent.lastAssignment || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {new Date(agent.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 rounded-lg transition-colors hover:bg-[var(--muted)]" style={{ color: "var(--muted-foreground)" }}>
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--muted)" }}>
                <AlertCircle size={20} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>No agents found</p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {search ? "Try a different search term" : "Add your first agent to begin routing"}
              </p>
              {!search && (
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium mt-1"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <Plus size={14} /> Add Agent
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <AddAgentModal
            onClose={() => setShowAdd(false)}
            onAdd={(a) => {
              setAgentList((prev) => [a, ...prev]);
              toastSuccess(`${a.name} added`, "Agent is ready to receive conversations");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
