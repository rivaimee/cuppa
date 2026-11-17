import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

async function tastingsCollection() {
  const db = await getDb();
  return db.collection("tastings");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tastingFields(data) {
  return {
    coffeeName: data.coffeeName.trim(),
    roaster: data.roaster.trim(),
    origin: typeof data.origin === "string" ? data.origin.trim() : "",
    rating: data.rating,
    notes: typeof data.notes === "string" ? data.notes.trim() : "",
  };
}

export async function findTastings({ roaster, origin, minRating, q } = {}) {
  const tastings = await tastingsCollection();
  const query = {};

  if (roaster) query.roaster = { $regex: escapeRegex(String(roaster)), $options: "i" };
  if (origin) query.origin = { $regex: escapeRegex(String(origin)), $options: "i" };
  if (minRating) query.rating = { $gte: Number(minRating) };

  if (q) {
    const pattern = { $regex: escapeRegex(String(q)), $options: "i" };
    query.$or = [{ coffeeName: pattern }, { roaster: pattern }, { notes: pattern }];
  }

  return tastings.find(query).sort({ createdAt: -1 }).toArray();
}

export async function findAverageRatings() {
  const tastings = await tastingsCollection();
  return tastings
    .aggregate([
      {
        $group: {
          _id: { coffeeName: "$coffeeName", roaster: "$roaster" },
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          coffeeName: "$_id.coffeeName",
          roaster: "$_id.roaster",
          average: { $round: ["$average", 1] },
          count: 1,
        },
      },
    ])
    .toArray();
}

export async function createTasting(userId, username, data) {
  const tastings = await tastingsCollection();
  const tasting = {
    userId,
    username,
    ...tastingFields(data),
    createdAt: new Date(),
  };
  const result = await tastings.insertOne(tasting);
  return { ...tasting, _id: result.insertedId };
}

export async function updateTasting(id, userId, data) {
  if (!ObjectId.isValid(id)) return null;
  const tastings = await tastingsCollection();
  return tastings.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: tastingFields(data) },
    { returnDocument: "after" },
  );
}

export async function deleteTasting(id, userId) {
  if (!ObjectId.isValid(id)) return false;
  const tastings = await tastingsCollection();
  const result = await tastings.deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount > 0;
}
