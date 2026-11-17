import express from "express";
import {
  findTastings,
  findAverageRatings,
  createTasting,
  updateTasting,
  deleteTasting,
} from "../db/tastings.js";
import { validateTasting } from "../validation/tasting.js";

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ errors: ["You must be logged in."] });
  }
  next();
}

router.get("/", async (req, res) => {
  try {
    const { roaster, origin, minRating, q } = req.query;
    const tastings = await findTastings({ roaster, origin, minRating, q });
    res.json(tastings);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not load reviews."] });
  }
});

router.get("/averages", async (req, res) => {
  try {
    const averages = await findAverageRatings();
    res.json(averages);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not load average ratings."] });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const errors = validateTasting(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const tasting = await createTasting(req.user._id.toString(), req.user.username, req.body);
    res.status(201).json(tasting);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not save review."] });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const errors = validateTasting(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const updated = await updateTasting(req.params.id, req.user._id.toString(), req.body);
    if (!updated) return res.status(404).json({ errors: ["Review not found."] });
    res.json(updated);
  } catch (_err) {
    res.status(500).json({ errors: ["Could not update review."] });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await deleteTasting(req.params.id, req.user._id.toString());
    if (!deleted) return res.status(404).json({ errors: ["Review not found."] });
    res.json({ message: "Deleted." });
  } catch (_err) {
    res.status(500).json({ errors: ["Could not delete review."] });
  }
});

export default router;
