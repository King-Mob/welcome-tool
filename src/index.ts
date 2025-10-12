import express from "express";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import handleMessage from "./message";
import handleJoin, { setWelcome, getWelcomeMessage } from "./join";
import { startDuckDB } from "./duckdb";

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
    "m.room.member", "m.room.message"
  ]
}

function generateRegistrationFile() {
  fs.writeFileSync(`./${moduleRegistration.id}.json`, JSON.stringify(moduleRegistration));
}

async function start() {
  const app = express();
  app.use(express.json());
  await startDuckDB()

  app.get("/", async (req, res) => {
    const htmlPath = path.resolve(__dirname, "../web/dist/index.html")

    res.sendFile(htmlPath);
  })

  app.post("/", async (req, res) => {
    const { event, botUserId } = req.body;

    console.log("event received", event)
    let response;

    if (event.type === "m.room.message")
      response = await handleMessage(event, botUserId);

    if (event.type === "m.room.member" && event.content.membership === "join") {
      response = await handleJoin(event);
    }

    console.log("response", response);

    res.send({ success: true, response });
  });

  app.get("/api/welcome", async (req, res) => {
    const { roomId } = req.query;

    const welcome = await getWelcomeMessage(roomId as string);

    res.send(welcome);
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
