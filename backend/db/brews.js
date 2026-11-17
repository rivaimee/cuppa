import { getDb } from "./connection.js";
import { ObjectId } from "mongodb";

async function brewsCollection() {
  const db = await getDb();
  return db.collection("brews");
}

function brewFields(data) {
  return {
    beanName: data.beanName.trim(),
    origin: data.origin,
    method: data.method,
    grindSize: data.grindSize,
    ratio: data.ratio,
    brewTime: data.brewTime,
    waterTemp: data.waterTemp,
    rating: data.rating,
    notes: data.notes,
    date: data.date,
  };
}

export async function findBrewsByUser(userId, { method, start, end } = {}) {
  const brews = await brewsCollection();
  const query = { userId };

  if (method) query.method = method;
  if (start || end) {
    query.date = {};
    if (start) query.date.$gte = start;
    if (end) query.date.$lte = end;
  }

  return brews.find(query).sort({ date: -1 }).toArray();
}

export async function findBestBrew(userId) {
  const brews = await brewsCollection();
  return brews.find({ userId }).sort({ rating: -1, date: -1 }).limit(1).next();
}

export async function findBrewById(id) {
  const brews = await brewsCollection();
  return brews.findOne({ _id: new ObjectId(id) });
}

export async function createBrew(userId, data) {
  const brews = await brewsCollection();
  const result = await brews.insertOne({
    userId,
    ...brewFields(data),
    createdAt: new Date(),
  });
  return findBrewById(result.insertedId);
}

export async function updateBrew(id, userId, data) {
  const brews = await brewsCollection();
  const result = await brews.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: brewFields(data) },
    { returnDocument: "after" },
  );
  return result;
}

export async function deleteBrew(id, userId) {
  const brews = await brewsCollection();
  const result = await brews.deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount > 0;
}
