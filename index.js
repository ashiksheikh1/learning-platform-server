const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;

const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     await client.connect();

    const db = client.db(process.env.AUTH_DB_NAME);
    const assignmentCollection = db.collection("createassignments");
   
app.post("/assignments", async (req, res) => {
  try {
    const query = req.body;

    const result = await assignmentCollection.insertOne({
      ...query,
      createdAt: new Date(),
    });

    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to create assignment",
      error: error.message,
    });
  }
});

app.get("/assignments", async (req, res) => {
  try {
    const result = await assignmentCollection
      .find()
    //   .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to get assignments",
      error: error.message,
    });
  }
});

app.patch("/assignments/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    const id = req.params.id;
    const updatedAssignment = req.body;

    const result = await assignmentCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          ...updatedAssignment,
          updatedAt: new Date(),
        },
      }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to update assignment",
      error: error.message,
    });
  }
});

app.delete("/assignments/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    const id = req.params.id;

    const result = await assignmentCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to delete assignment",
      error: error.message,
    });
  }
});

app.get("/assignments/:id", async (req, res) => {
  try {
    // const { ObjectId } = require("mongodb");

    const id = req.params.id;

    const result = await assignmentCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return res.status(404).send({
        message: "Assignment not found",
      });
    }

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to get assignment",
      error: error.message,
    });
  }
});






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment Platform API is running");
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});