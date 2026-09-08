import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Wifi, X, RefreshCw, Sun, Moon } from "lucide-react";
import { useTheme } from "../ui/ThemeContext";
import { useToast } from "../ui/Toast";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

interface Notification {
  id: string;
  type: "assignment" | "unassigned" | "info";
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "unassigned", message: "7 conversations are unassigned and waiting", time: "Just now", read: false },
  { id: "n2", type: "assignment", message: "+92 300 1234567 assigned to Ahmed Khan", time: "2 min ago", read: false },
  { id: "n3", type: "assignment", message: "+92 301 7654321 assigned to Ali Raza", time: "5 min ago", read: true },
  { id: "n4", type: "info", message: "Usman Ahmed went offline", time: "12 min ago", read: true },
  { id: "n5", type: "info", message: "Bilal Hassan has 6 active conversations", time: "18 min ago", read: true },
];

export function TopBar({ title, subtitle }: TopBarProps) {
  const { theme, toggle } = useTheme();
  const { info } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    info("All notifications marked as read");
  };

  return (
    <header
      className="flex items-center h-14 px-4 lg:px-6 border-b shrink-0 gap-3"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      {/* Mobile spacer */}
      <div className="w-10 lg:hidden" />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-sm font-semibold truncate"
          style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] truncate hidden md:block" style={{ color: "var(--muted-foreground)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border overflow-hidden"
                style={{ background: "var(--background)", borderColor: "var(--border)" }}
              >
                <Search size={13} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 text-xs bg-transparent outline-none"
                  style={{ color: "var(--foreground)" }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                  <X size={13} style={{ color: "var(--muted-foreground)" }} />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg transition-colors hover:bg-[var(--muted)]"
                style={{ color: "var(--muted-foreground)" }}
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--muted)]"
          style={{ color: "var(--muted-foreground)" }}
          aria-label="Toggle theme"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg transition-colors hover:bg-[var(--muted)]"
            style={{ color: "var(--muted-foreground)" }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-[8px] font-bold rounded-full flex items-center justify-center"
                style={{ background: "var(--status-error)", color: "white" }}
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-30 overflow-hidden"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
                  }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs font-medium" style={{ color: "var(--accent)" }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex gap-3 px-4 py-3 border-b last:border-0 transition-colors hover:bg-[var(--muted)]"
                        style={{
                          borderColor: "var(--border)",
                          background: n.read ? "transparent" : "rgba(16,185,129,0.03)",
                        }}
                      >
                        <div className="mt-1.5 shrink-0">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: n.read ? "transparent" : n.type === "unassigned" ? "var(--status-error)" : "var(--accent)",
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{n.message}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>{n.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* System status — desktop only */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ml-0.5"
          style={{ background: "rgba(16,185,129,0.08)", color: "var(--status-available)" }}
        >
          <Wifi size={12} />
          <span>Online</span>
        </div>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ml-1 shrink-0"
          style={{ background: "var(--accent)", color: "white" }}
        >
          MK
        </div>
      </div>
    </header>
  );
}
