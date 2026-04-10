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
}

const AdminDashboard: React.FC = () => {
  const [section, setSection] = useState<Section>("content");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: NavItem[] = [
    { id: "content", label: "Content Editor", icon: "✏️" },
    { id: "theme", label: "Theme Control", icon: "🎨" },
    { id: "announcements", label: "Announcements", icon: "📢" },
    { id: "requests", label: "Collab Requests", icon: "📋" },
    { id: "collaborators", label: "Collaborators", icon: "👥" },
    { id: "publications", label: "Publications", icon: "📚" },
    { id: "ideas", label: "Research Ideas", icon: "💡" },
    { id: "messages", label: "Contact Messages", icon: "✉️" },
    { id: "gallery", label: "Gallery", icon: "🖼️" },
  ];

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

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col"
        style={{
          width: sidebarOpen ? 240 : 0,
          minHeight: "100%",
          background: "var(--color-primary)",
          transition: "width 0.2s",
          overflow: "hidden",
        }}
      >
        {/* Sidebar header */}
        <div
          className="px-5 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p
            className="text-white font-black text-base leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Admin Dashboard
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Rahman Research Lab
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className="w-full flex items-center gap-3 px-5 py-3 text-left border-none cursor-pointer transition-colors"
              style={{
                background:
                  section === item.id
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                color: section === item.id ? "white" : "rgba(255,255,255,0.72)",
                fontWeight: section === item.id ? 700 : 500,
                fontSize: 14,
                borderLeft:
                  section === item.id
                    ? "3px solid var(--color-accent)"
                    : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className="ml-auto text-xs font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: "#ef4444", color: "white" }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <a
            href="/"
            className="text-xs font-semibold no-underline block"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            ← Back to Website
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center gap-4 px-6 py-3 border-b sticky top-16 z-10"
          style={{ background: "white", borderColor: "#e5e7eb" }}
        >
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="text-gray-500 bg-transparent border-none cursor-pointer p-1 rounded"
            aria-label="Toggle sidebar"
          >
            <div className="w-5 h-0.5 bg-gray-500 mb-1" />
            <div className="w-5 h-0.5 bg-gray-500 mb-1" />
            <div className="w-5 h-0.5 bg-gray-500" />
          </button>
          <h1 className="text-base font-black text-gray-800">
            {navItems.find((i) => i.id === section)?.icon}{" "}
            {navItems.find((i) => i.id === section)?.label}
          </h1>
        </div>

        {/* Section content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
