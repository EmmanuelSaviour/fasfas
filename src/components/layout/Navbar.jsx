import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logos/fasfas-logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const navLinkClass = ({ isActive }) =>
    `border-b-2 pb-1 transition-all duration-300 ${
      isActive
        ? "border-emerald-600 text-emerald-600"
        : "border-transparent text-gray-700 hover:border-emerald-600 hover:text-emerald-600"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block w-full rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
    }`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 shadow-sm backdrop-blur-xl">

      {/* ================================ */}
      {/* Main Navbar */}
      {/* ================================ */}

      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:h-24 md:px-8 md:py-0">

        {/* ================= Brand ================= */}

        <NavLink
          to="/"
          onClick={closeMenu}
          className="group flex min-w-0 cursor-pointer items-center"
        >
          <div className="flex shrink-0 items-center translate-y-2">
            <img
              src={logo}
              alt="FasFas Logo"
              className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-20 md:h-24"
            />
          </div>
        </NavLink>

        {/* ================= Desktop Navigation ================= */}

        <ul className="hidden items-center gap-12 text-base font-semibold md:flex">

          <li>
            <NavLink
              to="/"
              end
              className={navLinkClass}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={navLinkClass}
            >
              About
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/community"
              className={navLinkClass}
            >
              Community
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              className={navLinkClass}
            >
              Contact
            </NavLink>
          </li>

        </ul>

        {/* ================= Desktop Actions ================= */}

        <div className="hidden items-center gap-4 md:flex">

          <NavLink
            to="/login"
            className="rounded-xl px-5 py-2.5 font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-50"
          >
            🌿 Continue Growing
          </NavLink>

          <NavLink
            to="/register"
            className="rounded-xl bg-emerald-600 px-7 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
          >
            🌱 Plant Your Tree
          </NavLink>

        </div>

        {/* ================= Mobile Menu Button ================= */}

        <button
          type="button"
          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
          }
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl text-gray-700 transition-all duration-200 hover:bg-gray-100 active:scale-95 md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {/* ================================ */}
      {/* Mobile Navigation */}
      {/* ================================ */}

      {menuOpen && (
        <div className="border-t border-emerald-100 bg-white px-4 pb-5 pt-3 shadow-md md:hidden">

          <ul className="space-y-1">

            <li>
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                🏠 Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                🌱 About
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/community"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                👥 Community
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                onClick={closeMenu}
                className={mobileNavLinkClass}
              >
                ✉️ Contact
              </NavLink>
            </li>

          </ul>

          {/* ================= Mobile Actions ================= */}

          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">

            <NavLink
              to="/login"
              onClick={closeMenu}
              className="block w-full rounded-xl px-4 py-3 text-center font-semibold text-emerald-700 transition-all duration-200 hover:bg-emerald-50"
            >
              🌿 Continue Growing
            </NavLink>

            <NavLink
              to="/register"
              onClick={closeMenu}
              className="block w-full rounded-xl bg-emerald-600 px-4 py-3.5 text-center font-semibold text-white shadow-md transition-all duration-200 hover:bg-emerald-700 active:scale-95"
            >
              🌱 Plant Your Tree
            </NavLink>

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;