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
    await festivalsCollection.createIndex({ name: "text" });



    // all routes ↓

    // get all of data from the festivals collection
    app.get("/festivals", async (req, res) => {
        const { id, name, startDate, endDate } = req.query;

        try {
            if (id) {
                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid festival ID" });
                }
                const festival = await festivalsCollection.findOne({ _id: new ObjectId(id) });
                if (!festival) {
                    return res.status(404).json({ message: "Festival not found" });
                }
                return res.status(200).json(festival);
            }

            if (name) {
                const festivals = await festivalsCollection
                    .find({ name: { $regex: new RegExp(name, "i") } }) // Case-insensitive search
                    .toArray();
                if (festivals.length === 0) {
                    return res.status(404).json({ message: "No festivals found matching the name" });
                }
                return res.status(200).json(festivals);
            }

            if (startDate) {
                const festivals = await festivalsCollection
                    .find({ startDate })
                    .toArray();
                if (festivals.length === 0) {
                    return res.status(404).json({ message: "No festivals found with this start date" });
                }
                return res.status(200).json(festivals);
            }

            if (endDate) {
                const festivals = await festivalsCollection
                    .find({ endDate })
                    .toArray();
                if (festivals.length === 0) {
                    return res.status(404).json({ message: "No festivals found with this end date" });
                }
                return res.status(200).json(festivals);
            }

            const festivals = await festivalsCollection.find({}).toArray(); // Fetch all
            res.status(200).json(festivals);
        } catch (error) {
            console.error("Error fetching festivals:", error.message);
            res.status(500).json({ message: "Failed to fetch festivals" });
        }
    });





 // http://localhost:5001/festivals?id=674f38206160cd3d943298e0
 // http://localhost:5001/festivals?name=Soundstorm
 // http://localhost:5001/festivals?startDate=2024-11-29
 // http://localhost:5001/festivals?endDate=2025-01-23



    app.get("/search", async (req, res) => {
    const { name } = req.query;
    const { startDate } = req.query

    try {
        if (!name) {
            return res.status(400).json({ message: "Festival name is required" });
        }

        const results = await festivalsCollection
            .find({ name: { $regex: new RegExp(name, "i") } }) // Case-insensitive
            .toArray();

        if (results.length === 0) {
            return res.status(404).json({ message: "No festivals found" });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Error searching festivals:", error.message);
        res.status(500).json({ message: "Failed to search festivals" });
    }
});

//http://localhost:5001/search?name=Soundstorm


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
