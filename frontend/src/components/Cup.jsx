import React from "react";
import PropTypes from "prop-types";
import "./Cup.css";

export default function Cup({ filled }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      className={filled ? "cup cup--filled" : "cup cup--empty"}
      aria-hidden="true"
    >
      <path d="M4 3h12v9a6 6 0 0 1-6 6 6 6 0 0 1-6-6V3z" />
      <path d="M16 6h2a3 3 0 0 1 0 6h-2" fill="none" strokeWidth="1.6" stroke="currentColor" />
    </svg>
  );
}

Cup.propTypes = {
  filled: PropTypes.bool.isRequired,
};
