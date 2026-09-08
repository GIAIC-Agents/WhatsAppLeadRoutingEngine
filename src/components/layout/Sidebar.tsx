import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  GitFork,
  Activity,
  Settings,
  Plug,
  Zap,
  BarChart3,
  ChevronDown,
  HelpCircle,
  LogOut,
  Building2,
  Menu,
  X,
  Radio,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  soon?: boolean;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    group: "Main",
    items: [
      { label: "Overview", icon: <LayoutDashboard size={16} />, to: "/" },
      { label: "Conversations", icon: <MessageSquare size={16} />, to: "/conversations", badge: 7 },
      { label: "Agents", icon: <Users size={16} />, to: "/agents" },
    ],
  },
  {
    group: "Management",
    items: [
      { label: "Routing", icon: <GitFork size={16} />, to: "/routing" },
      { label: "Activity", icon: <Activity size={16} />, to: "/activity" },
      { label: "Settings", icon: <Settings size={16} />, to: "/settings" },
    ],
  },
  {
    group: "Expand",
    items: [
      { label: "Integrations", icon: <Plug size={16} />, to: "/integrations" },
      { label: "Automation", icon: <Zap size={16} />, soon: true },
      { label: "Analytics", icon: <BarChart3 size={16} />, soon: true },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent)" }}>
          <Radio size={14} color="white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold text-sm tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            RouteFlow
          </motion.span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded transition-colors hidden lg:flex items-center justify-center"
          style={{ color: "var(--muted-foreground)" }}
        >
          <Menu size={14} />
        </button>
      </div>

      {/* Workspace selector */}
      {!collapsed && (
        <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
          <button
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs transition-colors"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}
          >
            <Building2 size={13} style={{ color: "var(--muted-foreground)" }} />
            <span className="flex-1 text-left font-medium truncate">Acme Sales</span>
            <ChevronDown size={12} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p
                className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                {group.group}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) =>
                item.soon ? (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-md opacity-50 cursor-default select-none"
                  >
                    <span style={{ color: "var(--muted-foreground)" }}>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                          {item.label}
                        </span>
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                        >
                          Soon
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.to!}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150 relative group ${
                        isActive ? "font-medium" : "font-normal"
                      }`
                    }
                    style={({ isActive }) => ({
                      background: isActive ? "var(--secondary)" : "transparent",
                      color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                    })}
                    end={item.to === "/"}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                            style={{ background: "var(--accent)" }}
                          />
                        )}
                        <span style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                                style={{ background: "var(--status-error)", color: "white" }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t px-2 py-2 space-y-0.5 shrink-0" style={{ borderColor: "var(--border)" }}>
        <NavLink
          to="/help"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors"
          style={{ color: "var(--muted-foreground)" }}
        >
          <HelpCircle size={16} />
          {!collapsed && <span>Help</span>}
        </NavLink>
        <NavLink
          to="/login"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors"
          style={{ color: "var(--muted-foreground)" }}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </NavLink>

        {!collapsed && (
          <div
            className="flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-md"
            style={{ background: "var(--muted)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ background: "var(--accent)", color: "white" }}
            >
              MK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                Manager Khan
              </p>
              <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>
                Admin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-full border-r overflow-hidden shrink-0"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 border-r flex flex-col"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <button
                className="absolute top-3 right-3 p-1.5 rounded-md"
                style={{ color: "var(--muted-foreground)" }}
                onClick={() => setMobileOpen(false)}
              >
                <X size={16} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
