import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Overview", subtitle: "Monitor conversations, agent availability, and lead assignments" },
  "/conversations": { title: "Conversations", subtitle: "Manage and respond to inbound WhatsApp leads" },
  "/agents": { title: "Agents", subtitle: "Manage your sales team and control conversation availability" },
  "/routing": { title: "Routing", subtitle: "Control how new conversations are assigned to your team" },
  "/activity": { title: "Activity", subtitle: "Event log for routing and message activity" },
  "/settings": { title: "Settings", subtitle: "Configure your workspace and routing preferences" },
  "/integrations": { title: "Integrations", subtitle: "Connect external services to RouteFlow" },
  "/help": { title: "Help & Support", subtitle: "Documentation and contact" },
};

export function AppLayout() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? { title: "RouteFlow" };

  return (
    <div className="flex h-full" style={{ background: "var(--background)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
