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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/collaborators", label: "Collaborators" },
    { to: "/publications", label: "Publications" },
    { to: "/research-ideas", label: "Research Ideas" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  // Fetch collaborator photo if role is collaborator
  useEffect(() => {
    if (role !== "collaborator" || !appUser?.uid) return;
    getDocs(
      query(collection(db, "collaborators"), where("uid", "==", appUser.uid)),
    )
      .then((snap) => {
        if (!snap.empty) {
          setCollaboratorPhoto(snap.docs[0].data().photo ?? "");
        }
      })
      .catch(() => {});
  }, [role, appUser?.uid]);

  // Close dropdown when clicking outside
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

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

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
    <nav
      style={{
        background: "var(--color-navbar)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
      className="shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 no-underline flex-shrink-0"
          >
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="no-underline px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: isActive(l.to)
                    ? "var(--color-accent)"
                    : "rgba(255,255,255,0.85)",
                  fontWeight: isActive(l.to) ? 700 : 500,
                  borderBottom: isActive(l.to)
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side: Avatar or Login */}
          <div className="hidden md:flex items-center gap-3">
            {!role && (
              <Link
                to="/login"
                className="no-underline text-xs font-semibold px-4 py-1.5 rounded-lg border"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.4)",
                  background: "transparent",
                }}
              >
                Portal Login
              </Link>
            )}

            {/* Avatar dropdown — shown when logged in */}
            {(role === "admin" || role === "collaborator") && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full border-none cursor-pointer p-0.5"
                  style={{
                    background: dropdownOpen
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.1)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    transition: "all 0.15s ease",
                  }}
                  aria-label="Account menu"
                >
                  <AvatarCircle
                    photo={avatarPhoto}
                    initials={initials}
                    size={34}
                  />
                </button>

                {/* Dropdown panel */}
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
                    <style>{`
                      @keyframes dropdownFade {
                        from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                      }
                    `}</style>

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
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-none text-left"
                        style={{ background: "#fee2e2", color: "#991b1b" }}
                      >
                        <span>🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ background: "var(--color-navbar)" }}
        >
          {/* Mobile user info bar */}
          {(role === "admin" || role === "collaborator") && appUser && (
            <div
              className="flex items-center gap-3 py-3 mb-2 border-b"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <AvatarCircle photo={avatarPhoto} initials={initials} size={38} />
              <div>
                <p className="text-white text-sm font-bold">{appUser.name}</p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {appUser.email}
                </p>
              </div>
            </div>
          )}

          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="no-underline py-2 text-sm font-medium border-b"
              style={{
                color: "rgba(255,255,255,0.85)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              {l.label}
            </Link>
          ))}

          {!role && (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="no-underline text-sm font-semibold py-2"
              style={{ color: "var(--color-accent)" }}
            >
              Portal Login
            </Link>
          )}
          {role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="no-underline text-sm font-semibold py-2"
              style={{ color: "var(--color-accent)" }}
            >
              Admin Dashboard
            </Link>
          )}
          {role === "collaborator" && (
            <Link
              to="/collaborator-portal"
              onClick={() => setMenuOpen(false)}
              className="no-underline text-sm font-semibold py-2"
              style={{ color: "var(--color-accent)" }}
            >
              My Portal
            </Link>
          )}
          {(role === "admin" || role === "collaborator") && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="text-sm text-left py-2 bg-transparent border-none cursor-pointer font-semibold"
              style={{ color: "#f87171" }}
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
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

// ── Dropdown menu item ─────────────────────────────────────────
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
