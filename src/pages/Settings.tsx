import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, GitFork, Bell, Plug, ChevronRight, Check, Info } from "lucide-react";

const sections = [
  { key: "workspace", label: "Workspace", icon: <Building2 size={14} /> },
  { key: "team", label: "Team", icon: <Users size={14} /> },
  { key: "routing", label: "Routing", icon: <GitFork size={14} /> },
  { key: "notifications", label: "Notifications", icon: <Bell size={14} /> },
  { key: "integrations", label: "Integrations", icon: <Plug size={14} /> },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5.5 rounded-full transition-colors"
      style={{
        background: checked ? "var(--accent)" : "var(--muted)",
        width: 40,
        height: 22,
      }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        style={{ top: 3 }}
      />
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState("workspace");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    newLead: true,
    unassigned: true,
    agentOffline: false,
  });
  const [workspaceName, setWorkspaceName] = useState("Acme Sales");
  const [timezone, setTimezone] = useState("Asia/Karachi");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-full">
      {/* Settings nav */}
      <div
        className="w-52 border-r shrink-0 py-4 px-2"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left mb-0.5"
            style={{
              background: activeSection === s.key ? "var(--muted)" : "transparent",
              color: activeSection === s.key ? "var(--foreground)" : "var(--muted-foreground)",
              fontWeight: activeSection === s.key ? 500 : 400,
            }}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {activeSection === "workspace" && (
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                  Workspace
                </h2>
                <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>
                  Configure your workspace identity and preferences
                </p>
                <div className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="divide-y px-5" style={{ borderColor: "var(--border)" }}>
                    <SettingRow label="Workspace Name" description="Displayed in the sidebar and reports">
                      <input
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="px-3 py-1.5 text-sm rounded-lg border outline-none"
                        style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", minWidth: 180 }}
                      />
                    </SettingRow>
                    <SettingRow label="Workspace ID" description="Read-only identifier for API use">
                      <span className="phone-mono text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                        wks_acme_sales_01
                      </span>
                    </SettingRow>
                    <SettingRow label="Timezone" description="Used for reporting and timestamps">
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="px-3 py-1.5 text-sm rounded-lg border outline-none"
                        style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
                      >
                        <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                      </select>
                    </SettingRow>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "team" && (
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Team</h2>
                <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>Manage agents and permissions</p>
                <div
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Agent Management</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Add, edit, and manage your sales agents</p>
                  </div>
                  <a href="/agents" className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--accent)" }}>
                    Go to Agents <ChevronRight size={12} />
                  </a>
                </div>
              </div>
            )}

            {activeSection === "routing" && (
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Routing</h2>
                <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>Control assignment strategy and ownership rules</p>
                <div className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="divide-y px-5" style={{ borderColor: "var(--border)" }}>
                    <SettingRow label="Assignment Strategy" description="How new conversations are distributed">
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                        style={{ background: "rgba(16,185,129,0.1)", color: "var(--accent)" }}
                      >
                        <Check size={11} />
                        Round Robin
                      </span>
                    </SettingRow>
                    <SettingRow label="Persistent Ownership" description="Future messages route to the existing assigned agent">
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                        style={{ background: "rgba(59,130,246,0.08)", color: "var(--status-info)" }}
                      >
                        Enabled
                      </span>
                    </SettingRow>
                  </div>
                </div>
                <div
                  className="flex items-start gap-2 p-3 rounded-lg mt-3 text-xs"
                  style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                >
                  <Info size={12} className="mt-0.5 shrink-0" />
                  Routing strategy changes are managed through the Routing page. Some settings require backend configuration.
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Notifications</h2>
                <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>Control what alerts you receive</p>
                <div className="rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="divide-y px-5" style={{ borderColor: "var(--border)" }}>
                    <SettingRow label="New Lead Alert" description="Notify when a new inbound message arrives">
                      <Toggle checked={notifications.newLead} onChange={(v) => setNotifications({ ...notifications, newLead: v })} />
                    </SettingRow>
                    <SettingRow label="Unassigned Lead Alert" description="Notify when a conversation has no available agent">
                      <Toggle checked={notifications.unassigned} onChange={(v) => setNotifications({ ...notifications, unassigned: v })} />
                    </SettingRow>
                    <SettingRow label="Agent Offline Alert" description="Notify when an agent goes offline with active conversations">
                      <Toggle checked={notifications.agentOffline} onChange={(v) => setNotifications({ ...notifications, agentOffline: v })} />
                    </SettingRow>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "integrations" && (
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Integrations</h2>
                <p className="text-xs mb-5" style={{ color: "var(--muted-foreground)" }}>Connect external services</p>
                <div className="rounded-xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>WhatsApp Business</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Receive inbound conversations</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Save button for editable sections */}
            {["workspace", "notifications"].includes(activeSection) && (
              <div className="flex justify-end mt-5">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: saved ? "rgba(16,185,129,0.15)" : "var(--accent)", color: saved ? "var(--status-available)" : "white" }}
                >
                  {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
