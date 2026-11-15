import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CupRating from "./CupRating.jsx";
import "./TastingForm.css";

const BLANK = {
  coffeeName: "",
  roaster: "",
  origin: "",
  rating: 3,
  notes: "",
};

export default function TastingForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial || BLANK);
  }, [initial]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await onSave({ ...form, rating: Number(form.rating) });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="tasting-form" onSubmit={handleSubmit}>
      <h2>{initial ? "Edit review" : "Write a review"}</h2>

      <label htmlFor="tastingCoffeeName">Coffee name</label>
      <input
        id="tastingCoffeeName"
        value={form.coffeeName}
        onChange={(e) => update("coffeeName", e.target.value)}
        required
      />

      <label htmlFor="tastingRoaster">Roaster</label>
      <input
        id="tastingRoaster"
        value={form.roaster}
        onChange={(e) => update("roaster", e.target.value)}
        required
      />

      <label htmlFor="tastingOrigin">Origin (optional)</label>
      <input
        id="tastingOrigin"
        value={form.origin}
        onChange={(e) => update("origin", e.target.value)}
      />

      <span className="tasting-form__label">Rating</span>
      <CupRating rating={Number(form.rating)} onRate={(n) => update("rating", n)} />

      <label htmlFor="tastingNotes">Tasting notes</label>
      <textarea
        id="tastingNotes"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        rows={3}
      />

      {error && (
        <p className="tasting-form__error" role="status">
          {error}
        </p>
      )}

      <div className="tasting-form__buttons">
        <button type="submit">{initial ? "Save changes" : "Post review"}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

TastingForm.propTypes = {
  initial: PropTypes.shape({
    coffeeName: PropTypes.string,
    roaster: PropTypes.string,
    origin: PropTypes.string,
    rating: PropTypes.number,
    notes: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};
