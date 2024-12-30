import dotenv from "dotenv";
import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { ObjectId } from "mongodb";


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


    app.get("/festivals/:id", async (req, res) => {
              const { id } = req.params;

              console.log(`Request received for festival ID: ${id}`);
              if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid festival ID" });
              }

              try {
                const festival = await festivalsCollection.findOne({ _id: new ObjectId(id) });
                if (!festival) {
                  return res.status(404).json({ message: "Festival not found" });
                }

                res.status(200).json(festival);
              } catch (error) {
                console.error(`Error in /festivals/:id for ID: ${id}`, error);
                res.status(500).json({ message: "Failed to fetch festival" });
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
