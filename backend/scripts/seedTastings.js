import bcrypt from "bcryptjs";
import { getDb, closeDb } from "../db/connection.js";
import { findByUsername, createUser } from "../db/users.js";

const DEMO_PASSWORD = "demo12345";
const DEMO_USERNAMES = Array.from({ length: 8 }, (_, i) => `demo_taster${i + 1}`);
const RECORD_COUNT = Number(process.argv[2]) || 1200;

const COFFEES = [
  { coffeeName: "Ethiopia Yirgacheffe", origin: "Ethiopia" },
  { coffeeName: "Colombia Huila", origin: "Colombia" },
  { coffeeName: "Guatemala Antigua", origin: "Guatemala" },
  { coffeeName: "Kenya AA", origin: "Kenya" },
  { coffeeName: "Sumatra Mandheling", origin: "Indonesia" },
  { coffeeName: "Costa Rica Tarrazu", origin: "Costa Rica" },
  { coffeeName: "Brazil Cerrado", origin: "Brazil" },
  { coffeeName: "Honduras Marcala", origin: "Honduras" },
  { coffeeName: "Rwanda Nyungwe", origin: "Rwanda" },
  { coffeeName: "Panama Geisha", origin: "Panama" },
  { coffeeName: "Peru Cajamarca", origin: "Peru" },
  { coffeeName: "Mexico Chiapas", origin: "Mexico" },
];

const ROASTERS = [
  "Counter Culture",
  "Stumptown",
  "Intelligentsia",
  "Blue Bottle",
  "George Howell",
  "Onyx Coffee Lab",
  "PT's Coffee",
  "Heart Coffee",
];

const TASTING_NOTES = [
  "Bright and fruity, great as a pour over.",
  "Rich and chocolatey, works well as espresso.",
  "Smooth and sweet, easy to drink every day.",
  "A little sour for my taste, but clean.",
  "Nutty with a long caramel finish.",
  "Floral and light, best without milk.",
  "Strong and bold, held up well in a French press.",
  "Balanced and mellow, I would buy it again.",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinLastDays(days) {
  const past = Date.now() - Math.floor(Math.random() * days) * 24 * 60 * 60 * 1000;
  return new Date(past);
}

function buildSyntheticTasting(user) {
  const coffee = randomFrom(COFFEES);
  return {
    userId: user._id.toString(),
    username: user.username,
    coffeeName: coffee.coffeeName,
    roaster: randomFrom(ROASTERS),
    origin: coffee.origin,
    rating: 1 + Math.floor(Math.random() * 5),
    notes: randomFrom(TASTING_NOTES),
    createdAt: randomDateWithinLastDays(180),
  };
}

async function getOrCreateDemoUser(username) {
  const existing = await findByUsername(username);
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return createUser({ username, passwordHash });
}

async function seed() {
  const db = await getDb();

  const demoUsers = [];
  for (const username of DEMO_USERNAMES) {
    demoUsers.push(await getOrCreateDemoUser(username));
  }
  console.log(`Demo users: ${DEMO_USERNAMES.join(", ")} (password: ${DEMO_PASSWORD})`);

  const demoUserIds = demoUsers.map((user) => user._id.toString());
  const tastings = db.collection("tastings");

  const deleted = await tastings.deleteMany({ userId: { $in: demoUserIds } });
  console.log(`Cleared ${deleted.deletedCount} previously seeded demo reviews.`);

  const records = Array.from({ length: RECORD_COUNT }, () =>
    buildSyntheticTasting(randomFrom(demoUsers)),
  );
  const result = await tastings.insertMany(records);
  console.log(`Inserted ${result.insertedCount} synthetic reviews.`);
}

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
