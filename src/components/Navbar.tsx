"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      // First check local cookie (fast path)
      const hasCookie = document.cookie.split(";").some((item) => item.trim().startsWith("admin_logged_in="));
      if (hasCookie) {
        setIsLoggedIn(true);
        return;
      }

      // Fallback: verify with API
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setIsLoggedIn(!!data.loggedIn);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, [pathname]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/fellowships", label: "Post Doc Fellowship", className: "nav-postdoc" },
    { href: "/programs", label: "Programs" },
    { href: "/publications", label: "Publications" },
    { href: "/membership", label: "Membership" },
    { href: "/contact", label: "Contact" },
    {
      href: "/admin",
      label: isLoggedIn ? "Admin Panel" : "Login",
      className: "btn btn-primary"
    },
  ];

  return (
    <nav>
      <div className="container nav-content">
        <Link href="/" className="logo">
          <img src="/assets/logo.png" alt="ARP Logo" className="logo-img" />
        </Link>

        {/* Desktop Links */}
        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${pathname === link.href ? "active" : ""} ${link.className || ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-btn"
          aria-label="Toggle Menu"
          style={{
            background: "none",
            border: "none",
            color: "var(--primary)",
            cursor: "pointer",
            padding: "0.5rem"
          }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="mobile-dropdown">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`${pathname === link.href ? "active" : ""} ${link.className || ""}`}
              style={{
                color: pathname === link.href ? "var(--accent)" : "var(--secondary)",
                fontWeight: 600,
                fontSize: "1rem"
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
