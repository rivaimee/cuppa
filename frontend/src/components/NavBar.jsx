import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BrandMark from "./BrandMark.jsx";
import "./NavBar.css";

function navLinkClass({ isActive }) {
  return isActive ? "nav-bar__links-active" : undefined;
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="nav-bar">
      <NavLink to="/" className="nav-bar__brand">
        <BrandMark />
        Cuppa
      </NavLink>
      <div className="nav-bar__links">
        <NavLink to="/brews" className={navLinkClass}>
          My Brews
        </NavLink>
        <NavLink to="/tastings" className={navLinkClass}>
          Tasting Board
        </NavLink>
        {user ? (
          <>
            <span className="nav-bar__user">{user.username}</span>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>
              Log in
            </NavLink>
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

NavBar.propTypes = {};
