import React from "react";
import PropTypes from "prop-types";
import "./TastingFilterBar.css";

export default function TastingFilterBar({ filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="tasting-filter-bar">
      <label htmlFor="filter-roaster">Roaster</label>
      <input
        id="filter-roaster"
        type="text"
        value={filters.roaster}
        onChange={(e) => update("roaster", e.target.value)}
      />

      <label htmlFor="filter-origin">Origin</label>
      <input
        id="filter-origin"
        type="text"
        value={filters.origin}
        onChange={(e) => update("origin", e.target.value)}
      />

      <label htmlFor="filter-rating">Rating</label>
      <select
        id="filter-rating"
        value={filters.minRating}
        onChange={(e) => update("minRating", e.target.value)}
      >
        <option value="">Any rating</option>
        {[2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} and up
          </option>
        ))}
      </select>
    </div>
  );
}

TastingFilterBar.propTypes = {
  filters: PropTypes.shape({
    roaster: PropTypes.string,
    origin: PropTypes.string,
    minRating: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
