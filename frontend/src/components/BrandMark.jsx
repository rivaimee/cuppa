import React from "react";
import "./BrandMark.css";

export default function BrandMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="brand-mark">
      <path d="M4 10h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6v-5z" />
      <path d="M16 11h2a2.5 2.5 0 0 1 0 5h-2" fill="none" strokeWidth="1.6" stroke="currentColor" />
      <path
        d="M8 7c-.8-1 .8-1.6 0-3"
        fill="none"
        strokeWidth="1.3"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path
        d="M12 7c-.8-1 .8-1.6 0-3"
        fill="none"
        strokeWidth="1.3"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

BrandMark.propTypes = {};
