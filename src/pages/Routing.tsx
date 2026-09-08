import { motion } from "framer-motion";
import { GitFork, Lock, Check, ChevronRight, Info, Zap, Target, BarChart } from "lucide-react";
import { agents } from "../data/mockData";

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

const roundRobinPreview = [
  { lead: "Lead 01", agent: "Ahmed Khan", color: "#10B981" },
  { lead: "Lead 02", agent: "Muneeb Malik", color: "#3B82F6" },
  { lead: "Lead 03", agent: "Ali Raza", color: "#F59E0B" },
  { lead: "Lead 04", agent: "Ahmed Khan", color: "#10B981" },
  { lead: "Lead 05", agent: "Muneeb Malik", color: "#3B82F6" },
  { lead: "Lead 06", agent: "Ali Raza", color: "#F59E0B" },
];

export default function Routing() {
  const availableAgents = agents.filter((a) => a.status !== "offline");
  const offlineAgents = agents.filter((a) => a.status === "offline");

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

          {/* Assignment strategy */}
          <motion.div variants={fadeUp} className="rounded-xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Assignment Strategy</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                How new conversations are distributed to your team
              </p>
            </div>
            <div className="p-5 space-y-2">
              {[
                {
                  key: "round_robin",
                  icon: <GitFork size={16} />,
                  label: "Round Robin",
                  desc: "New conversations are distributed evenly among all available agents in rotation.",
                  active: true,
                  soon: false,
                },
                {
                  key: "least_busy",
                  icon: <BarChart size={16} />,
                  label: "Least Busy",
                  desc: "Assign to the agent with the fewest active conversations.",
                  active: false,
                  soon: true,
                },
                {
                  key: "skill_based",
                  icon: <Target size={16} />,
                  label: "Skill Based",
                  desc: "Route conversations based on agent skills and customer topic.",
                  active: false,
                  soon: true,
                },
                {
                  key: "priority",
                  icon: <Zap size={16} />,
                  label: "Priority Based",
                  desc: "Route to senior agents first, fall back to available agents.",
                  active: false,
                  soon: true,
                },
              ].map((strategy) => (
                <div
                  key={strategy.key}
                  className="flex items-start gap-4 p-4 rounded-xl border transition-colors"
                  style={{
                    borderColor: strategy.active ? "var(--accent)" : "var(--border)",
                    background: strategy.active ? "rgba(16,185,129,0.04)" : "transparent",
                    opacity: strategy.soon ? 0.55 : 1,
                  }}
                >
                  <div className="mt-0.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: strategy.active ? "rgba(16,185,129,0.12)" : "var(--muted)",
                        color: strategy.active ? "var(--accent)" : "var(--muted-foreground)",
                      }}
                    >
                      {strategy.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {strategy.label}
                      </span>
                      {strategy.active && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: "var(--accent)", color: "white" }}
                        >
                          <Check size={9} />
                          Active
                        </span>
                      )}
                      {strategy.soon && (
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                        >
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {strategy.desc}
                    </p>
                  </div>
                  <div className="mt-1.5">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: strategy.active ? "var(--accent)" : "var(--border)",
                        background: strategy.active ? "var(--accent)" : "transparent",
                      }}
                    >
                      {strategy.active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Eligible agents */}
            <motion.div variants={fadeUp} className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Eligible Agents</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Only available agents participate in automatic assignment
                </p>
              </div>
              <div className="p-4 space-y-1.5">
                {availableAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3 px-2 py-2 rounded-lg">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: agent.status === "available" ? "var(--status-available)" : "var(--status-busy)" }}
                    />
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                      {agent.initials}
                    </div>
                    <span className="flex-1 text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {agent.name}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                      {agent.activeConversations} active
                    </span>
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.12)" }}
                    >
                      <Check size={10} style={{ color: "var(--accent)" }} />
                    </div>
                  </div>
                ))}
                {offlineAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-3 px-2 py-2 rounded-lg opacity-40">
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--status-offline)" }} />
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                      {agent.initials}
                    </div>
                    <span className="flex-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {agent.name} — Offline
                    </span>
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ownership rule */}
            <motion.div variants={fadeUp} className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Conversation Ownership</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Controls how returning customers are handled
                </p>
              </div>
              <div className="p-5">
                <div
                  className="flex items-start gap-4 p-4 rounded-xl border"
                  style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.04)" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(59,130,246,0.12)" }}
                  >
                    <Lock size={16} style={{ color: "var(--status-info)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Persistent Ownership
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(59,130,246,0.12)", color: "var(--status-info)" }}
                      >
                        Enabled
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      Once a conversation is assigned to an agent, all future messages from that customer will continue to route
                      to the same agent — regardless of their current availability.
                    </p>
                    <div
                      className="flex items-start gap-1.5 mt-3 p-2.5 rounded-lg text-[10px]"
                      style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                    >
                      <Info size={11} className="mt-0.5 shrink-0" />
                      This behavior is enforced by the backend. Contact your administrator to change ownership rules.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Round Robin Preview */}
          <motion.div variants={fadeUp} className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Routing Preview</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Illustrative preview of how new leads would be distributed
                </p>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                Preview
              </span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {roundRobinPreview.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{ borderColor: "var(--border)", background: "var(--background)" }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium truncate" style={{ color: "var(--muted-foreground)" }}>
                        {item.lead}
                      </p>
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>
                        <span className="inline-block mr-1" style={{ color: "var(--muted-foreground)" }}>→</span>
                        {item.agent.split(" ")[0]}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-[10px] mt-3 text-center" style={{ color: "var(--muted-foreground)" }}>
                This is a visual illustration based on current available agents. Actual routing depends on live availability at time of inbound message.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
