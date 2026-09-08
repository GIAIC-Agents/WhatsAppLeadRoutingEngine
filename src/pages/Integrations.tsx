import { motion } from "framer-motion";
import { MessageCircle, Database, Users, Calendar, Hash, ExternalLink } from "lucide-react";

const integrations = [
  {
    key: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect your WhatsApp Business account to receive inbound customer conversations directly in RouteFlow.",
    icon: <MessageCircle size={22} />,
    color: "#25D366",
    status: "coming_soon",
    primary: true,
  },
  {
    key: "hubspot",
    name: "HubSpot CRM",
    description: "Sync conversations and customer data with HubSpot automatically.",
    icon: <Database size={22} />,
    color: "#FF7A59",
    status: "coming_soon",
  },
  {
    key: "salesforce",
    name: "Salesforce",
    description: "Push leads and conversations into your Salesforce instance.",
    icon: <Users size={22} />,
    color: "#00A1E0",
    status: "coming_soon",
  },
  {
    key: "zoho",
    name: "Zoho CRM",
    description: "Integrate with Zoho to manage your lead pipeline.",
    icon: <Database size={22} />,
    color: "#E42527",
    status: "coming_soon",
  },
  {
    key: "gcal",
    name: "Google Calendar",
    description: "Schedule follow-up calls and demos directly from conversations.",
    icon: <Calendar size={22} />,
    color: "#4285F4",
    status: "coming_soon",
  },
  {
    key: "slack",
    name: "Slack",
    description: "Receive routing alerts and unassigned conversation notifications in Slack.",
    icon: <Hash size={22} />,
    color: "#4A154B",
    status: "coming_soon",
  },
];

export default function Integrations() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
        {/* WhatsApp primary card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border overflow-hidden mb-6"
          style={{ borderColor: "rgba(37,211,102,0.3)", background: "var(--card)" }}
        >
          <div
            className="px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ background: "linear-gradient(135deg, rgba(37,211,102,0.06) 0%, transparent 60%)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(37,211,102,0.12)", color: "#25D366" }}
            >
              <MessageCircle size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                  WhatsApp Business
                </h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: "rgba(37,211,102,0.12)", color: "#25D366" }}
                >
                  Coming Soon
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Connect your WhatsApp Business account to receive inbound customer conversations directly in RouteFlow.
                Once connected, all incoming WhatsApp messages will be routed automatically to your sales agents.
              </p>
            </div>
            <button
              disabled
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed shrink-0"
              style={{ background: "#25D366", color: "white" }}
            >
              Connect WhatsApp
            </button>
          </div>
          <div
            className="px-8 py-3 border-t flex items-center gap-2 text-xs"
            style={{ borderColor: "rgba(37,211,102,0.15)", color: "var(--muted-foreground)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--status-busy)" }} />
            WhatsApp Cloud API integration is in development. Join the waitlist to be notified.
          </div>
        </motion.div>

        {/* Other integrations */}
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>
          More Integrations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {integrations.slice(1).map((integration, i) => (
            <motion.div
              key={integration.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-start gap-4 p-5 rounded-xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${integration.color}14`, color: integration.color }}
              >
                {integration.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {integration.name}
                  </span>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                  >
                    Soon
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {integration.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--muted-foreground)" }}>
          Missing an integration?{" "}
          <button className="underline" style={{ color: "var(--accent)" }}>
            Request one
          </button>
        </p>
      </div>
    </div>
  );
}
