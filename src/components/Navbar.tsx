import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSiteContent } from "../firebase/hooks";

const Navbar: React.FC = () => {
  const { role, logout } = useAuth();
  const { content } = useSiteContent();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link to="/" className="flex items-center gap-2 no-underline">
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

          {/* Desktop Links */}
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {role === "admin" && (
              <Link
                to="/admin"
                className="no-underline text-xs font-bold px-3 py-1.5 rounded-md"
                style={{ background: "var(--color-accent)", color: "#1f2937" }}
              >
                Admin Dashboard
              </Link>
            )}
            {role === "collaborator" && (
              <Link
                to="/collaborator-portal"
                className="no-underline text-xs font-bold px-3 py-1.5 rounded-md"
                style={{ background: "var(--color-accent)", color: "#1f2937" }}
              >
                My Portal
              </Link>
            )}
            {(role === "admin" || role === "collaborator") && (
              <button
                onClick={logout}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.4)",
                  background: "transparent",
                }}
              >
                Logout
              </button>
            )}
            {!role && (
              <Link
                to="/login"
                className="no-underline text-xs font-semibold px-3 py-1.5 rounded-md border"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.4)",
                  background: "transparent",
                }}
              >
                Portal Login
              </Link>
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
          {(role === "admin" || role === "collaborator") && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="text-sm text-left py-2 text-red-400 bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
