import React, { useState } from "react";
import PropTypes from "prop-types";
import Cup from "./Cup.jsx";
import "./CupRating.css";

// Read-only by default, clickable when onRate is passed
export default function CupRating({ rating, onRate }) {

export default function CupRating({ rating, onRate }) {
  const [hoverValue, setHoverValue] = useState(0);
  const interactive = typeof onRate === "function";
  const displayValue = interactive && hoverValue > 0 ? hoverValue : rating;

  if (!interactive) {
    return (
      <span className="cup-rating" role="img" aria-label={`${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Cup key={n} filled={n <= rating} />
        ))}
      </span>
    );
  }

  return (
    <span className="cup-rating cup-rating--interactive" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className="cup-rating__button"
          aria-label={`Rate ${n} out of 5`}
          aria-pressed={n === rating}
          onMouseEnter={() => setHoverValue(n)}
          onMouseLeave={() => setHoverValue(0)}
          onFocus={() => setHoverValue(n)}
          onBlur={() => setHoverValue(0)}
          onClick={() => onRate(n)}
        >
          <Cup filled={n <= displayValue} />
        </button>
      ))}
    </span>
  );
}

CupRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRate: PropTypes.func,
};
