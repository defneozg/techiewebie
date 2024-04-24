const app = require("./app.js");
const connectionDB = require('./db');
const { MongoClient, ObjectID } = require('mongodb');
const url = "mongodb+srv://defneozg:BbTfpypQLwTaAAgS@cluster0.uxgeglj.mongodb.net/";
const client = new MongoClient(url);

// Connexion à MongoDB
connectionDB();

const posts = [
  {
      title : "Premiere discussion",
      body : "yayyy"
  },
  {
      title : "Deuxieme discussion",
      body : "i wanna sleepo"
  },
]

async function insertManyPosts(posts) {
try {
await client.connect();
const db = client.db('techie_webie_db');
const result = await db.collection('discussions').insertMany(posts);
console.log(result);
} finally {
await client.close();
}
}

insertManyPosts(posts);


const port = 4000;
app.listen(port, () => {
  console.log(`Serveur actif sur le port ${port}`);
});