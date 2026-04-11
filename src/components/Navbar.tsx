import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";

const Navbar: React.FC = () => {
  const { role, logout, appUser } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collaboratorPhoto, setCollaboratorPhoto] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/about", label: "About", icon: "ℹ️" },
    { to: "/collaborators", label: "Collaborators", icon: "👥" },
    { to: "/publications", label: "Publications", icon: "📚" },
    { to: "/research-ideas", label: "Research Ideas", icon: "💡" },
    { to: "/gallery", label: "Gallery", icon: "🖼️" },
    { to: "/contact", label: "Contact", icon: "✉️" },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch collaborator photo
  useEffect(() => {
    if (role !== "collaborator" || !appUser?.uid) return;
    getDocs(
      query(collection(db, "collaborators"), where("uid", "==", appUser.uid)),
    )
      .then((snap) => {
        if (!snap.empty) setCollaboratorPhoto(snap.docs[0].data().photo ?? "");
      })
      .catch(() => {});
  }, [role, appUser?.uid]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const initials = appUser?.name
    ? appUser.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const avatarPhoto = role === "collaborator" ? collaboratorPhoto : "";

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .nav-link-pill {
          position: relative;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link-pill:hover {
          background: rgba(255,255,255,0.1) !important;
        }
        .hamburger-line {
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 99px;
          background: white;
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }
      `}</style>

      <nav
        style={{
          background: "var(--color-navbar)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          transition: "box-shadow 0.3s ease",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.18)"
            : "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2 no-underline flex-shrink-0"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent), #f97316)",
                  boxShadow: "0 2px 8px rgba(245,158,11,0.4)",
                  color: "#1f2937",
                }}
              >
                R
              </div>
              <span
                style={{
                  color: "var(--color-accent)",
                  fontFamily: "var(--font-heading)",
                }}
                className="text-xl font-black tracking-tight"
              >
                Syed's
              </span>
              <span className="text-white text-xl font-black tracking-tight">
                Lab
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="nav-link-pill no-underline px-3.5 py-2 rounded-lg text-sm"
                  style={{
                    color: isActive(l.to)
                      ? "var(--color-accent)"
                      : "rgba(255,255,255,0.82)",
                    fontWeight: isActive(l.to) ? 700 : 500,
                    background: isActive(l.to)
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                    borderBottom: isActive(l.to)
                      ? "2px solid var(--color-accent)"
                      : "2px solid transparent",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── Right side ── */}
            <div className="hidden lg:flex items-center gap-3">
              {!role && (
                <Link
                  to="/login"
                  className="no-underline text-xs font-bold px-4 py-2 rounded-lg transition-all"
                  style={{
                    color: "#1f2937",
                    background: "var(--color-accent)",
                    boxShadow: "0 2px 8px rgba(245,158,11,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-1px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 4px 16px rgba(245,158,11,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 2px 8px rgba(245,158,11,0.35)";
                  }}
                >
                  Portal Login
                </Link>
              )}

              {/* Avatar dropdown */}
              {(role === "admin" || role === "collaborator") && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2.5 rounded-full border-none cursor-pointer px-2 py-1"
                    style={{
                      background: dropdownOpen
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(255,255,255,0.08)",
                      border: "1.5px solid rgba(255,255,255,0.25)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <AvatarCircle
                      photo={avatarPhoto}
                      initials={initials}
                      size={32}
                    />
                    <div className="text-left hidden xl:block">
                      <p
                        className="text-white text-xs font-bold leading-tight"
                        style={{ maxWidth: 100 }}
                      >
                        {appUser?.name?.split(" ")[0] ?? "User"}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {role}
                      </p>
                    </div>
                    <span
                      className="text-white text-xs"
                      style={{
                        transform: dropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        opacity: 0.6,
                      }}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 rounded-2xl overflow-hidden"
                      style={{
                        width: 280,
                        background: "white",
                        boxShadow:
                          "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
                        border: "1px solid #e5e7eb",
                        zIndex: 200,
                        animation: "dropdownFade 0.18s ease",
                      }}
                    >
                      {/* Profile header */}
                      <div
                        className="px-5 pt-5 pb-4"
                        style={{ background: "var(--color-primary)" }}
                      >
                        <div className="flex items-center gap-3">
                          <AvatarCircle
                            photo={avatarPhoto}
                            initials={initials}
                            size={48}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-black text-sm leading-tight truncate">
                              {appUser?.name ?? "User"}
                            </p>
                            <p
                              className="text-xs mt-0.5 truncate"
                              style={{ color: "rgba(255,255,255,0.6)" }}
                            >
                              {appUser?.email ?? ""}
                            </p>
                            <span
                              className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background:
                                  role === "admin"
                                    ? "var(--color-accent)"
                                    : "rgba(255,255,255,0.15)",
                                color: role === "admin" ? "#1f2937" : "white",
                              }}
                            >
                              {role === "admin"
                                ? "Administrator"
                                : "Collaborator"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-2">
                        {role === "admin" && (
                          <DropdownItem
                            to="/admin"
                            icon="⚙️"
                            label="Admin Dashboard"
                            onClick={() => setDropdownOpen(false)}
                          />
                        )}
                        {role === "collaborator" && (
                          <DropdownItem
                            to="/collaborator-portal"
                            icon="🧪"
                            label="My Portal"
                            onClick={() => setDropdownOpen(false)}
                          />
                        )}
                        <DropdownItem
                          to="/"
                          icon="🏠"
                          label="View Website"
                          onClick={() => setDropdownOpen(false)}
                        />
                      </div>

                      {/* Logout */}
                      <div
                        className="px-3 pb-3 pt-1 border-t"
                        style={{ borderColor: "#f0f0f0" }}
                      >
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none text-left transition-all"
                          style={{ background: "#fee2e2", color: "#991b1b" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#fecaca")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#fee2e2")
                          }
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Mobile right: avatar + hamburger ── */}
            <div className="flex lg:hidden items-center gap-2">
              {(role === "admin" || role === "collaborator") && (
                <AvatarCircle
                  photo={avatarPhoto}
                  initials={initials}
                  size={32}
                />
              )}

              {/* Animated hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-xl border-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.1)" }}
                aria-label="Toggle menu"
              >
                <span
                  className="hamburger-line"
                  style={{
                    transform: menuOpen
                      ? "translateY(6px) rotate(45deg)"
                      : "none",
                  }}
                />
                <span
                  className="hamburger-line"
                  style={{
                    opacity: menuOpen ? 0 : 1,
                    width: menuOpen ? "0px" : "22px",
                  }}
                />
                <span
                  className="hamburger-line"
                  style={{
                    transform: menuOpen
                      ? "translateY(-6px) rotate(-45deg)"
                      : "none",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile backdrop ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease",
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className="fixed top-0 right-0 h-full z-50 lg:hidden flex flex-col"
        style={{
          width: "min(320px, 85vw)",
          background: "var(--color-primary)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: menuOpen ? "-8px 0 40px rgba(0,0,0,0.25)" : "none",
          overflowY: "auto",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 no-underline"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent), #f97316)",
                color: "#1f2937",
              }}
            >
              R
            </div>
            <span
              style={{
                color: "var(--color-accent)",
                fontFamily: "var(--font-heading)",
              }}
              className="font-black"
            >
              Syed's Lab
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer text-white text-lg font-bold"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            ×
          </button>
        </div>

        {/* User profile card */}
        {(role === "admin" || role === "collaborator") && appUser && (
          <div
            className="mx-4 mt-4 rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-3">
              <AvatarCircle photo={avatarPhoto} initials={initials} size={44} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm truncate">
                  {appUser.name}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {appUser.email}
                </p>
                <span
                  className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background:
                      role === "admin"
                        ? "var(--color-accent)"
                        : "rgba(255,255,255,0.15)",
                    color: role === "admin" ? "#1f2937" : "white",
                  }}
                >
                  {role === "admin" ? "Administrator" : "Collaborator"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div className="flex-1 px-4 py-4">
          <p
            className="text-xs font-black uppercase tracking-widest mb-3 px-2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Navigation
          </p>
          {navLinks.map((l) => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="no-underline flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all"
                style={{
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  color: active
                    ? "var(--color-accent)"
                    : "rgba(255,255,255,0.8)",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  borderLeft: active
                    ? "3px solid var(--color-accent)"
                    : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 16 }}>{l.icon}</span>
                {l.label}
                {active && (
                  <span
                    className="ml-auto text-xs"
                    style={{ color: "var(--color-accent)" }}
                  >
                    ●
                  </span>
                )}
              </Link>
            );
          })}

          {/* Portal links */}
          {(role === "admin" || role === "collaborator") && (
            <>
              <p
                className="text-xs font-black uppercase tracking-widest mb-3 mt-5 px-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Portal
              </p>
              {role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="no-underline flex items-center gap-3 px-3 py-3 rounded-xl mb-1"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <span>⚙️</span> Admin Dashboard
                </Link>
              )}
              {role === "collaborator" && (
                <Link
                  to="/collaborator-portal"
                  onClick={() => setMenuOpen(false)}
                  className="no-underline flex items-center gap-3 px-3 py-3 rounded-xl mb-1"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <span>🧪</span> My Portal
                </Link>
              )}
            </>
          )}
        </div>

        {/* Bottom actions */}
        <div
          className="px-4 pb-6 flex-shrink-0 flex flex-col gap-2"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 16,
          }}
        >
          {!role && (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="no-underline flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{
                background: "var(--color-accent)",
                color: "#1f2937",
                boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
              }}
            >
              🔑 Portal Login
            </Link>
          )}
          {(role === "admin" || role === "collaborator") && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-none cursor-pointer"
              style={{ background: "#fee2e2", color: "#991b1b" }}
            >
              🚪 Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// ── Avatar circle ──────────────────────────────────────────────
const AvatarCircle: React.FC<{
  photo: string;
  initials: string;
  size: number;
}> = ({ photo, initials, size }) => {
  const [err, setErr] = useState(false);
  if (photo && !err) {
    return (
      <img
        src={photo}
        alt="avatar"
        onError={() => setErr(true)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      className="flex items-center justify-center text-white font-black flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, var(--color-accent), var(--color-secondary))",
        fontSize: size * 0.36,
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
};

// ── Dropdown item ──────────────────────────────────────────────
const DropdownItem: React.FC<{
  to: string;
  icon: string;
  label: string;
  onClick: () => void;
}> = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="no-underline flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700"
    style={{ transition: "background 0.12s" }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    <span style={{ fontSize: 16 }}>{icon}</span>
    {label}
  </Link>
);

export default Navbar;
