import express from "express";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import handleMessage from "./message";
import handleJoin, { setWelcome } from "./join";
import { getPseudoState } from "./pseudoState";

const port = 5051;

const moduleRegistration = {
  id: "welcome",
  uuid: uuidv4(),
  url: `http://localhost:${port}`,
  emoji: "🐙",
  wake_word: "!welcome",
  title: "Auto Welcome Bot",
  description: "This module creates an auto-welcome for new users joining your group",
  event_types: [
    "m.room.join"
  ]
}

function generateRegistrationFile() {
  fs.writeFileSync(`./${moduleRegistration.id}.json`, JSON.stringify(moduleRegistration));
}

async function start() {
  const app = express();
  app.use(express.json());

  app.get("/", async (req, res) => {
    const htmlPath = path.resolve(__dirname, "../../web/dist/index.html")

    res.sendFile(htmlPath);
  })

  app.post("/", async (req, res) => {
    const { event, botUserId } = req.body;

    console.log(event)
    let response = {};

    if (event.type === "m.room.message")
      response = await handleMessage(event, botUserId);

    if (event.type === "m.room.join")
      response = await handleJoin(event, botUserId);

    console.log(response)

    res.send({ success: true, response });
  });

  app.get("/api/welcome", async (req, res) => {
    const { roomId } = req.query;

    const state = await getPseudoState(roomId as string);

    res.send(state || { assignedRoles: [] });
  })

  app.post("/api/welcome", async (req, res) => {
    const { roomId } = req.query;
    const { welcomeMessage } = req.body;

    await setWelcome(roomId as string, welcomeMessage);

    res.send({ success: true })
  })

  app.listen(port);
};

generateRegistrationFile();
start();
