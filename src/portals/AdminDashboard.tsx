import React, { useState } from "react";
import {
  ContactMessages,
  ManageAnnouncements,
  ManageIdeas,
} from "../admin/AdminSections";
import CollaboratorRequests from "../admin/CollaboratorRequests";
import ContentEditor from "../admin/ContentEditor";
import ManageCollaborators from "../admin/ManageCollaborators";
import ManageGallery from "../admin/ManageGallery";
import ManagePublications from "../admin/ManagePublications";
import ThemeControl from "../admin/ThemeControl";

type Section =
  | "content"
  | "theme"
  | "requests"
  | "collaborators"
  | "publications"
  | "ideas"
  | "messages"
  | "announcements"
  | "gallery";

interface NavItem {
  id: Section;
  label: string;
  icon: string;
  badge?: number;
  group: string;
}

const AdminDashboard: React.FC = () => {
  const [section, setSection] = useState<Section>("content");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "content", label: "Content Editor", icon: "✏️", group: "Site" },
    { id: "theme", label: "Theme Control", icon: "🎨", group: "Site" },
    { id: "announcements", label: "Announcements", icon: "📢", group: "Site" },
    { id: "requests", label: "Collab Requests", icon: "📋", group: "People" },
    {
      id: "collaborators",
      label: "Collaborators",
      icon: "👥",
      group: "People",
    },
    {
      id: "publications",
      label: "Publications",
      icon: "📚",
      group: "Research",
    },
    { id: "ideas", label: "Research Ideas", icon: "💡", group: "Research" },
    { id: "messages", label: "Contact Messages", icon: "✉️", group: "Inbox" },
    { id: "gallery", label: "Gallery", icon: "🖼️", group: "Media" },
  ];

  const groups = Array.from(new Set(navItems.map((i) => i.group)));

  const renderSection = () => {
    switch (section) {
      case "content":
        return <ContentEditor />;
      case "theme":
        return <ThemeControl />;
      case "announcements":
        return <ManageAnnouncements />;
      case "requests":
        return <CollaboratorRequests />;
      case "collaborators":
        return <ManageCollaborators />;
      case "publications":
        return <ManagePublications />;
      case "ideas":
        return <ManageIdeas />;
      case "messages":
        return <ContactMessages />;
      case "gallery":
        return <ManageGallery />;
      default:
        return null;
    }
  };

  const currentItem = navItems.find((i) => i.id === section);

  const SidebarContent = () => (
    <>
      {/* Logo area */}
      <div
        className="px-5 py-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent), #f97316)",
              boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
            }}
          >
            🔬
          </div>
          <div>
            <p
              className="text-white font-black text-sm leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Admin Panel
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Rahman Research Lab
            </p>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav
        className="flex-1 py-4 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {groups.map((group) => (
          <div key={group} className="mb-1">
            <p
              className="px-5 py-1.5 text-xs font-black uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {group}
            </p>
            {navItems
              .filter((i) => i.group === group)
              .map((item) => {
                const isActive = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSection(item.id);
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 mx-1 py-2.5 text-left border-none cursor-pointer transition-all rounded-xl"
                    style={{
                      width: "calc(100% - 8px)",
                      background: isActive
                        ? "rgba(255,255,255,0.12)"
                        : "transparent",
                      color: isActive ? "white" : "rgba(255,255,255,0.6)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 13.5,
                      marginBottom: 2,
                    }}
                  >
                    {/* Active indicator */}
                    <div
                      className="w-1 h-5 rounded-full flex-shrink-0 transition-all"
                      style={{
                        background: isActive
                          ? "var(--color-accent)"
                          : "transparent",
                        boxShadow: isActive
                          ? "0 0 8px var(--color-accent)"
                          : "none",
                      }}
                    />
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span className="whitespace-nowrap flex-1">
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className="text-xs font-black px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "#ef4444",
                          color: "white",
                          fontSize: 10,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <a
          href="/"
          className="flex items-center gap-2 text-xs font-semibold no-underline py-2 px-3 rounded-lg transition-all"
          style={{
            color: "rgba(255,255,255,0.45)",
            background: "rgba(255,255,255,0.05)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "white";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.45)";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.05)";
          }}
        >
          <span>←</span>
          <span>Back to Website</span>
        </a>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "#f1f5f9" }}>
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 h-screen"
        style={{
          width: sidebarOpen ? 240 : 64,
          background: "var(--color-primary)",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          zIndex: 30,
          boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        {sidebarOpen ? (
          <SidebarContent />
        ) : (
          /* Collapsed sidebar — icons only */
          <div className="flex flex-col items-center py-4 gap-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent), #f97316)",
              }}
            >
              🔬
            </div>
            {navItems.map((item) => {
              const isActive = section === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  title={item.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                    fontSize: 16,
                  }}
                >
                  {item.icon}
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className="fixed top-0 left-0 h-full z-50 flex flex-col lg:hidden"
        style={{
          width: 260,
          background: "var(--color-primary)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: mobileOpen ? "8px 0 32px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e2e8f0",
            height: 56,
            boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden flex flex-col justify-center gap-1 w-8 h-8 bg-transparent border-none cursor-pointer"
          >
            <div
              className="w-5 h-0.5 rounded-full"
              style={{ background: "#374151" }}
            />
            <div
              className="w-4 h-0.5 rounded-full"
              style={{ background: "#374151" }}
            />
            <div
              className="w-5 h-0.5 rounded-full"
              style={{ background: "#374151" }}
            />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="hidden lg:flex flex-col justify-center gap-1 w-8 h-8 bg-transparent border-none cursor-pointer"
          >
            <div
              className="w-5 h-0.5 rounded-full"
              style={{ background: "#374151" }}
            />
            <div
              className="w-4 h-0.5 rounded-full"
              style={{ background: "#374151" }}
            />
            <div
              className="w-5 h-0.5 rounded-full"
              style={{ background: "#374151" }}
            />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm hidden sm:block">
              Dashboard
            </span>
            <span className="text-gray-300 hidden sm:block">›</span>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 16 }}>{currentItem?.icon}</span>
              <h1 className="font-black text-gray-800 text-sm">
                {currentItem?.label}
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg no-underline transition-all"
              style={{
                color: "var(--color-primary)",
                background: "rgba(30,58,95,0.08)",
                border: "1px solid rgba(30,58,95,0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--color-primary)";
                (e.currentTarget as HTMLElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(30,58,95,0.08)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--color-primary)";
              }}
            >
              <span>←</span>
              <span>Website</span>
            </a>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 py-1"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid #e2e8f0",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
            height: 60,
          }}
        >
          {navItems.slice(0, 5).map((item) => {
            const isActive = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="flex flex-col items-center gap-0.5 border-none bg-transparent cursor-pointer px-2 py-1 rounded-xl transition-all"
                style={{
                  color: isActive ? "var(--color-primary)" : "#9ca3af",
                  minWidth: 44,
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span
                  className="text-center font-semibold"
                  style={{
                    fontSize: 9,
                    letterSpacing: "-0.2px",
                    color: isActive ? "var(--color-primary)" : "#9ca3af",
                  }}
                >
                  {item.label.split(" ")[0]}
                </span>
                {isActive && (
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--color-accent)" }}
                  />
                )}
              </button>
            );
          })}
          {/* More button for remaining items */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 border-none bg-transparent cursor-pointer px-2 py-1 rounded-xl"
            style={{ color: "#9ca3af", minWidth: 44 }}
          >
            <span style={{ fontSize: 18 }}>⋯</span>
            <span style={{ fontSize: 9, fontWeight: 600 }}>More</span>
          </button>
        </nav>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "24px 16px 80px", maxWidth: "100%" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Page header card */}
            <div
              className="rounded-2xl px-6 py-5 mb-6 flex items-center gap-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                boxShadow: "0 8px 32px rgba(30,58,95,0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {currentItem?.icon}
              </div>
              <div>
                <h2
                  className="text-white font-black text-lg leading-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {currentItem?.label}
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Rahman Research Lab — Admin Dashboard
                </p>
              </div>
            </div>

            {/* Section content */}
            <div
              className="rounded-2xl p-5 lg:p-7"
              style={{
                background: "white",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #f0f4f8",
              }}
            >
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
