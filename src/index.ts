import express from "express";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import handleMessage, { getLeaderboard } from "./message";
import { startDuckDB } from "./duckdb";

const port = 5058;

export const moduleRegistration = {
  id: "leaderboard",
  uuid: uuidv4(),
  url: `http://localhost:${port}`,
  emoji: "🏆",
  wake_word: "leaderboard",
  title: "Linktracking Leaderboard",
  description: "This module creates a leaderboard for linksharing in your group",
  event_types: [
     "m.room.message"
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

    
    console.log("response", response);

    res.send({ success: true, response });
  });

  app.get("/api/leaderboard", async (req, res) => {
    const { roomId } = req.query;

    console.log(roomId)

    const leaderboard = await getLeaderboard(roomId as string); 

    console.log(leaderboard)

    res.send(leaderboard);
  })

  app.listen(port);
};

generateRegistrationFile();
start();
