import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const PORT = process.env.PORT || 5001;

(async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let dbClient;

  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    console.log("Connected to MongoDB successfully!");

    const database = dbClient.db(DATABASE_NAME);
    const festivalsCollection = database.collection("festivals");
    const performersCollection = database.collection("performers")


    // all routes ↓

    // get all of data from the festivals collection
    app.get("/festivals", async (req, res) => {
      try {
        const festivals = await festivalsCollection.find({}).toArray();
        res.status(200).json(festivals);
      } catch (error) {
        console.error("Error fetching festivals:", error.message);
        res.status(500).json({ message: "Failed to fetch festivals" });
      }
    });

    // get all of data from the performers collection
    app.get("/performers", async (req, res) => {
      try {
        const performers = await performersCollection.find({}).toArray();
        res.status(200).json(performers);
      } catch (error) {
        console.error("Error fetching performers:", error.message);
        res.status(500).json({ message: "Failed to fetch performers" });
      }
    });


    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    process.on("SIGINT", async () => {
      await dbClient.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
})();
