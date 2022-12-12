import { MongoClient } from "mongodb";

// /api/new-album
// POST /api/new-album

async function handler(req, res) {
  if (req.method === "DELETE") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://zenu98:tjwogml98s@cluster0.chknf5c.mongodb.net/albums?retryWrites=true&w=majority"
    );
    const db = client.db();

    const albumsCollection = db.collection("albums");

    const result = await albumsCollection.deleteOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: "Album deleted" });
  }
}

export default handler;
