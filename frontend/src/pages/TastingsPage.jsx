import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import TastingFilterBar from "../components/TastingFilterBar.jsx";
import TastingCard from "../components/TastingCard.jsx";
import TastingForm from "../components/TastingForm.jsx";
import "./TastingsPage.css";

export default function TastingsPage() {
  const { user } = useAuth();
  const [tastings, setTastings] = useState([]);
  const [averages, setAverages] = useState([]);
  const [filters, setFilters] = useState({ roaster: "", origin: "", minRating: "" });
  const [editingTasting, setEditingTasting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadTastings = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.roaster) params.set("roaster", filters.roaster);
    if (filters.origin) params.set("origin", filters.origin);
    if (filters.minRating) params.set("minRating", filters.minRating);

    const res = await fetch(`/api/tastings?${params.toString()}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.errors?.[0] || "Could not load reviews.");
    }
    const data = await res.json();
    setTastings(Array.isArray(data) ? data : []);
  }, [filters]);

  const loadAverages = useCallback(async () => {
    const res = await fetch("/api/tastings/averages");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.errors?.[0] || "Could not load average ratings.");
    }
    const data = await res.json();
    setAverages(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    setPageError("");
    loadTastings()
      .catch((err) => setPageError(err.message))
      .finally(() => setLoading(false));
  }, [loadTastings]);

  useEffect(() => {
    loadAverages().catch((err) => setPageError(err.message));
  }, [loadAverages]);

  function averageFor(tasting) {
    return averages.find(
      (a) => a.coffeeName === tasting.coffeeName && a.roaster === tasting.roaster,
    );
  }

  async function handleSave(data) {
    const url = editingTasting ? `/api/tastings/${editingTasting._id}` : "/api/tastings";
    const method = editingTasting ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.errors?.[0] || "Could not save review.");

    setShowForm(false);
    setEditingTasting(null);
    setPageError("");
    try {
      await Promise.all([loadTastings(), loadAverages()]);
    } catch (err) {
      setPageError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this review?")) return;
    setPageError("");

    try {
      const res = await fetch(`/api/tastings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0] || "Could not delete review.");
      }
      await Promise.all([loadTastings(), loadAverages()]);
    } catch (err) {
      setPageError(err.message);
    }
  }

  function handleEdit(tasting) {
    setEditingTasting(tasting);
    setShowForm(true);
  }

  return (
    <div className="tastings-page">
      <h1 className="tastings-page__title">Tasting Board</h1>

      {pageError && (
        <p className="tastings-page__error" role="status">
          {pageError}
        </p>
      )}

      <div className="tastings-page__toolbar">
        <TastingFilterBar filters={filters} onChange={setFilters} />
        {user ? (
          <button
            type="button"
            onClick={() => {
              setEditingTasting(null);
              setShowForm(true);
            }}
          >
            Write a review
          </button>
        ) : (
          <p className="tastings-page__login-note">
            <Link to="/login">Log in</Link> to write a review.
          </p>
        )}
      </div>

      {showForm && (
        <TastingForm
          initial={editingTasting}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTasting(null);
          }}
        />
      )}

      {loading ? (
        <p className="tastings-page__loading">Loading reviews...</p>
      ) : tastings.length === 0 ? (
        <p className="tastings-page__empty">No reviews found.</p>
      ) : (
        <div className="tastings-page__list">
          {tastings.map((tasting) => (
            <TastingCard
              key={tasting._id}
              tasting={tasting}
              average={averageFor(tasting)}
              isOwner={Boolean(user) && user.username === tasting.username}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
