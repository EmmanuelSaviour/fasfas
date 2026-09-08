import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logos/fasfas-logo.png";

function DashboardNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
    }`;

  return (
    <header className="relative border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="group flex min-w-0 items-center gap-2 sm:gap-3"
          onClick={handleNavClick}
        >
          <img
            src={logo}
            alt="FasFas Logo"
            className="h-10 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
          />

          <div className="hidden leading-tight sm:block">
            <h1 className="text-xl font-bold tracking-tight text-emerald-700">
              FasFas
            </h1>

            <p className="text-xs font-medium leading-tight text-gray-500">
              Keep Moving.
              <br />
              Keep Growing.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/dashboard"
            end
            className={navLinkClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/runs"
            className={navLinkClass}
          >
            Runs
          </NavLink>

          <NavLink
            to="/dashboard/progress"
            className={navLinkClass}
          >
            Progress
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={navLinkClass}
          >
            Profile
          </NavLink>
        </nav>

        {/* Desktop Logout */}
        <div className="hidden md:flex">
          <button
            onClick={handleLogout}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-600 active:scale-95"
          >
            Log out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-gray-700 transition-all duration-200 hover:bg-gray-100 active:scale-95"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-3 shadow-md md:hidden">
          <nav className="space-y-1">

            <NavLink
              to="/dashboard"
              end
              onClick={handleNavClick}
              className={mobileNavLinkClass}
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="/dashboard/runs"
              onClick={handleNavClick}
              className={mobileNavLinkClass}
            >
              🏃 Runs
            </NavLink>

            <NavLink
              to="/dashboard/progress"
              onClick={handleNavClick}
              className={mobileNavLinkClass}
            >
              📈 Progress
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              onClick={handleNavClick}
              className={mobileNavLinkClass}
            >
              👤 Profile
            </NavLink>

          </nav>

          {/* Mobile Logout */}
          <div className="mt-3 border-t border-gray-100 pt-3">
            <button
              onClick={handleLogout}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
            >
              🚪 Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default DashboardNavbar;