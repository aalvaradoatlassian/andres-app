import bodyParser from "body-parser";
import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 5000;

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

client.connect();
console.log("Connected successfully to server");
const db = client.db("local");
const collection = db.collection("Messages");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//const messages: any[] = [];

const getMessages = async (request: any, response: any) => {
  const messages = await collection.find().toArray();
  response.json(messages);
};

const postMessages = async (request: any, response: any) => {
  const action = request.query.action;

  console.log("start");
  await collection.insertOne(request.body);
  response.status(201);
  response.json(request.body);
  console.log("end");
  return;
};

const deleteMessage = async (request: any, response: any) => {
  const messageId = request.params.id;
  const deleteMessage = await collection.deleteOne({ id: messageId });
  response.status(200).json({ message: "Message deleted successfully" });
};

const deleteAll = async (request: any, response: any) => {
  const deletedAll = await collection.deleteMany();
  response.status(200).json({ message: "Messages deleted successfully" });
};

const updateMessage = async (request: any, response: any) => {
  const messageId = request.params.id;
  const updatedMessage = request.body.message;
  const update = await collection.updateOne(
    { id: messageId },
    { $set: { message: updatedMessage } }
  );
  response.status(200).json({ message: "Message deleted successfully" });
};

const updateMessagesOrder = async (request: any, response: any) => {
  const updatedMessages = request.body;
  await collection.deleteMany();
  await collection.insertMany(updatedMessages);
  response.status(200).json({ message: "Messages order updated successfully" });
};

// user
app.get("/api/messages", getMessages);

// messages
app.post("/api/messages", postMessages);

app.delete("/api/messages/:id", deleteMessage);

app.delete("/api/messages", deleteAll);

app.put("/api/messages/:id", updateMessage);

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));

app.put("/api/messages", updateMessagesOrder);
