import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Lock,
  AlertTriangle,
  Send,
  MoreHorizontal,
  X,
  CheckCheck,
  Check,
  UserPlus,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { conversations, agents, getAgentById, getAgentName, type Conversation } from "../data/mockData";
import { MessageSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";

type FilterTab = "all" | "unassigned" | "active" | "closed";

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { color: string; bg: string; label: string }> = {
    active: { color: "var(--status-available)", bg: "rgba(16,185,129,0.1)", label: "Active" },
    unassigned: { color: "var(--status-error)", bg: "rgba(239,68,68,0.1)", label: "Unassigned" },
    closed: { color: "var(--status-offline)", bg: "rgba(148,163,184,0.1)", label: "Closed" },
  };
  const c = cfg[status] || cfg.closed;
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

function ConversationListItem({ conv, selected, onClick }: { conv: Conversation; selected: boolean; onClick: () => void }) {
  const agent = conv.assignedAgentId ? getAgentById(conv.assignedAgentId) : null;
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 border-b transition-all"
      style={{
        borderColor: "var(--border)",
        background: selected ? "rgba(16,185,129,0.05)" : "transparent",
        borderLeft: selected ? "2px solid var(--accent)" : "2px solid transparent",
      }}
    >
      <div className="flex items-start gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {conv.unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />}
              <span className="phone-mono text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>
                {conv.customerPhone}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{conv.lastMessageTime}</span>
              {conv.unreadCount > 0 && (
                <span className="w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center" style={{ background: "var(--accent)", color: "white" }}>
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
          {conv.customerName && (
            <p className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)" }}>{conv.customerName}</p>
          )}
          <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{conv.lastMessage}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <StatusBadge status={conv.status} />
            {agent && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{
                  background: agent.status === "available" ? "var(--status-available)" : agent.status === "busy" ? "var(--status-busy)" : "var(--status-offline)",
                }} />
                {agent.name}
              </span>
            )}
            {!agent && conv.status === "unassigned" && (
              <span className="text-[10px] font-medium" style={{ color: "var(--status-error)" }}>⚠ No agent</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ content, direction, timestamp, agentId, status }: {
  content: string; direction: "inbound" | "outbound"; timestamp: string; agentId?: string; status?: string;
}) {
  const agentName = agentId ? getAgentName(agentId) : null;
  return (
    <div className={`flex ${direction === "outbound" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[68%] flex flex-col gap-1 ${direction === "outbound" ? "items-end" : "items-start"}`}>
        {direction === "outbound" && agentName && (
          <span className="text-[10px] px-1" style={{ color: "var(--muted-foreground)" }}>{agentName}</span>
        )}
        <div className={`px-4 py-2.5 text-sm leading-relaxed ${direction === "inbound" ? "bubble-inbound" : "bubble-outbound"}`}>
          {content}
        </div>
        <div className={`flex items-center gap-1 px-1 ${direction === "outbound" ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{timestamp}</span>
          {direction === "outbound" && status && (
            <span style={{ color: status === "read" ? "var(--status-info)" : "var(--muted-foreground)" }}>
              {status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Conversations() {
  const { success: toastSuccess, info: toastInfo, warning: toastWarning } = useToast();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0].id);
  const [messageText, setMessageText] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [convList, setConvList] = useState(conversations);

  const handleSelectConv = (id: string) => {
    setLoadingMessages(true);
    setSelectedId(id);
    setTimeout(() => setLoadingMessages(false), 400);
  };

  const handleAssign = () => {
    if (!selectedAssignee || !selectedId) return;
    const agent = agents.find((a) => a.id === selectedAssignee);
    setConvList((prev) =>
      prev.map((c) => c.id === selectedId ? { ...c, assignedAgentId: selectedAssignee, status: "active" as const } : c)
    );
    setShowAssignModal(false);
    setSelectedAssignee(null);
    toastSuccess(`Assigned to ${agent?.name}`, "Conversation ownership updated");
  };

  const handleClose = () => {
    if (!selectedId) return;
    setConvList((prev) =>
      prev.map((c) => c.id === selectedId ? { ...c, status: "closed" as const } : c)
    );
    toastInfo("Conversation closed");
  };

  const filtered = convList
    .filter((c) => {
      if (activeTab === "unassigned") return c.status === "unassigned";
      if (activeTab === "active") return c.status === "active";
      if (activeTab === "closed") return c.status === "closed";
      return true;
    })
    .filter((c) => search === "" || c.customerPhone.includes(search) || (c.customerName?.toLowerCase().includes(search.toLowerCase())));

  const selected = convList.find((c) => c.id === selectedId);
  const assignedAgent = selected?.assignedAgentId ? getAgentById(selected.assignedAgentId) : null;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: convList.length },
    { key: "unassigned", label: "Unassigned", count: convList.filter((c) => c.status === "unassigned").length },
    { key: "active", label: "Active", count: convList.filter((c) => c.status === "active").length },
    { key: "closed", label: "Closed", count: convList.filter((c) => c.status === "closed").length },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* List panel */}
      <div
        className="w-72 lg:w-80 border-r flex flex-col shrink-0"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--muted)" }}>
            <Search size={13} style={{ color: "var(--muted-foreground)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 text-xs bg-transparent outline-none"
              style={{ color: "var(--foreground)" }}
            />
            {search && <button onClick={() => setSearch("")}><X size={12} style={{ color: "var(--muted-foreground)" }} /></button>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-3 pt-2 gap-0" style={{ borderColor: "var(--border)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-colors relative"
              style={{
                color: activeTab === tab.key ? "var(--foreground)" : "var(--muted-foreground)",
                borderBottom: activeTab === tab.key ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="px-1 py-0.5 rounded text-[9px] font-bold ml-0.5"
                  style={{
                    background: tab.key === "unassigned" && tab.count > 0 ? "var(--status-error)" : "var(--muted)",
                    color: tab.key === "unassigned" && tab.count > 0 ? "white" : "var(--muted-foreground)",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-40 gap-2">
                <MessageSquare size={20} style={{ color: "var(--muted-foreground)" }} />
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>No conversations</p>
              </motion.div>
            ) : (
              filtered.map((conv) => (
                <motion.div key={conv.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ConversationListItem conv={conv} selected={selectedId === conv.id} onClick={() => handleSelectConv(conv.id)} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 flex overflow-hidden">
        {selected ? (
          <>
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b shrink-0" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="phone-mono text-sm font-semibold" style={{ color: "var(--foreground)" }}>{selected.customerPhone}</span>
                    {selected.customerName && <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>· {selected.customerName}</span>}
                    <StatusBadge status={selected.status} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {assignedAgent ? `Assigned to ${assignedAgent.name}` : "No agent assigned"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{ background: "var(--accent)", color: "white" }}
                  >
                    <UserPlus size={12} />
                    {assignedAgent ? "Reassign" : "Assign"}
                  </button>
                  {selected.status === "active" && (
                    <button
                      onClick={handleClose}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--muted)]"
                      style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                    >
                      <XCircle size={12} />
                      Close
                    </button>
                  )}
                  <button className="p-2 rounded-lg transition-colors hover:bg-[var(--muted)]" style={{ color: "var(--muted-foreground)" }}>
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>

              {/* Banners */}
              {assignedAgent && (
                <div
                  className="flex items-start gap-2.5 px-5 py-2.5 text-xs border-b"
                  style={{ background: "rgba(59,130,246,0.04)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <Lock size={12} style={{ color: "var(--status-info)", flexShrink: 0, marginTop: 2 }} />
                  <span>
                    <strong>Owned by {assignedAgent.name}.</strong>{" "}
                    Future messages from this customer will continue to route to {assignedAgent.name.split(" ")[0]} unless reassigned.
                  </span>
                </div>
              )}
              {!assignedAgent && selected.status === "unassigned" && (
                <div
                  className="flex items-start gap-2.5 px-5 py-2.5 text-xs border-b"
                  style={{ background: "rgba(239,68,68,0.04)", borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  <AlertTriangle size={12} style={{ color: "var(--status-error)", flexShrink: 0, marginTop: 2 }} />
                  <span>
                    <strong>No available agent.</strong> This conversation is waiting for assignment.{" "}
                    <button onClick={() => setShowAssignModal(true)} className="underline font-medium" style={{ color: "var(--accent)" }}>
                      Assign manually
                    </button>
                  </span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ background: "var(--background)" }}>
                {loadingMessages ? (
                  <>
                    <MessageSkeleton align="left" />
                    <MessageSkeleton align="right" />
                    <MessageSkeleton align="left" />
                  </>
                ) : selected.messages && selected.messages.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                        Today
                      </span>
                      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    </div>
                    {selected.messages.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.25 }}
                      >
                        <MessageBubble
                          content={msg.content}
                          direction={msg.direction}
                          timestamp={msg.timestamp}
                          agentId={msg.agentId}
                          status={msg.status}
                        />
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <MessageSquare size={24} style={{ color: "var(--muted-foreground)" }} />
                    <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>No messages yet</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t px-4 py-3 shrink-0" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div
                  className="flex items-end gap-2 rounded-xl border px-3.5 py-2.5"
                  style={{ borderColor: messageText.trim() ? "var(--accent)" : "var(--border)", background: "var(--background)", transition: "border-color 0.15s" }}
                >
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (messageText.trim()) {
                          toastWarning("Demo mode", "Messages are not actually sent in this preview");
                          setMessageText("");
                        }
                      }
                    }}
                    placeholder="Type a message... (Enter to send)"
                    rows={1}
                    className="flex-1 text-sm bg-transparent outline-none resize-none"
                    style={{ color: "var(--foreground)", maxHeight: 100 }}
                  />
                  <button
                    onClick={() => {
                      if (messageText.trim()) {
                        toastWarning("Demo mode", "Messages are not actually sent in this preview");
                        setMessageText("");
                      }
                    }}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      background: messageText.trim() ? "var(--accent)" : "var(--muted)",
                      color: messageText.trim() ? "white" : "var(--muted-foreground)",
                    }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Details sidebar */}
            <div className="hidden xl:flex w-60 flex-col border-l overflow-y-auto" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Details</h3>
              </div>
              <div className="px-5 py-4 space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Customer</p>
                  <p className="phone-mono text-xs" style={{ color: "var(--foreground)" }}>{selected.customerPhone}</p>
                  {selected.customerName && <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{selected.customerName}</p>}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Assigned Agent</p>
                  {assignedAgent ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "var(--accent)", color: "white" }}>
                        {assignedAgent.initials}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{assignedAgent.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{
                            background: assignedAgent.status === "available" ? "var(--status-available)" : assignedAgent.status === "busy" ? "var(--status-busy)" : "var(--status-offline)",
                          }} />
                          <span className="text-[10px] capitalize" style={{ color: "var(--muted-foreground)" }}>{assignedAgent.status}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: "var(--status-error)" }}>Unassigned</p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Status</p>
                  <StatusBadge status={selected.status} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>Started</p>
                  <p className="text-xs" style={{ color: "var(--foreground)" }}>
                    {new Date(selected.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                <div className="rounded-xl p-3 space-y-1.5" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <div className="flex items-center gap-1.5">
                    <Lock size={11} style={{ color: "var(--status-info)" }} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--status-info)" }}>Ownership</span>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    Persistent ownership enabled. Future messages route to the assigned agent automatically.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--muted)" }}>
              <MessageSquare size={20} style={{ color: "var(--muted-foreground)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Select a conversation</p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Choose from the list to view messages</p>
          </div>
        )}
      </div>

      {/* Assign modal */}
      <AnimatePresence>
        {showAssignModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black backdrop-blur-[2px]" onClick={() => setShowAssignModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-w-[calc(100vw-32px)] rounded-2xl border shadow-2xl overflow-hidden"
              style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {assignedAgent ? "Reassign Conversation" : "Assign Agent"}
                </h2>
                <button onClick={() => setShowAssignModal(false)} className="p-1.5 rounded-lg hover:bg-[var(--muted)]">
                  <X size={15} style={{ color: "var(--muted-foreground)" }} />
                </button>
              </div>

              {assignedAgent && (
                <div className="px-5 py-3 border-b text-xs" style={{ background: "rgba(245,158,11,0.05)", borderColor: "var(--border)", color: "var(--foreground)" }}>
                  <AlertTriangle size={11} className="inline mr-1.5" style={{ color: "var(--status-busy)" }} />
                  Currently owned by <strong>{assignedAgent.name}</strong>. Reassigning transfers conversation ownership.
                </div>
              )}

              <div className="p-4 space-y-1 max-h-60 overflow-y-auto">
                {agents.filter((a) => a.status !== "offline").map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAssignee(agent.id)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-left"
                    style={{
                      background: selectedAssignee === agent.id ? "rgba(16,185,129,0.08)" : "transparent",
                      border: selectedAssignee === agent.id ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
                    }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      {agent.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{agent.name}</p>
                      <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{agent.activeConversations} active convs</p>
                    </div>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        background: agent.status === "available" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                        color: agent.status === "available" ? "var(--status-available)" : "var(--status-busy)",
                      }}
                    >
                      {agent.status}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2.5 px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => { setShowAssignModal(false); setSelectedAssignee(null); }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm border font-medium hover:bg-[var(--muted)] transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedAssignee}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: selectedAssignee ? "var(--accent)" : "var(--muted)",
                    color: selectedAssignee ? "white" : "var(--muted-foreground)",
                    cursor: selectedAssignee ? "pointer" : "not-allowed",
                  }}
                >
                  {assignedAgent ? "Reassign" : "Assign"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
