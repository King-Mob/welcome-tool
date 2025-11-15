import "./App.css";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getLeaderboard } from "./requests";
import Markdown from "react-markdown";

export default function App() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [leaderboard, setLeaderboard] = useState("");

  async function loadLeaderboard(roomId: string) {
    const leaderboard = await getLeaderboard(roomId);
    console.log(leaderboard)
    setLeaderboard(leaderboard);
  }

  useEffect(() => {
    if (roomId) {
      setLeaderboard(roomId);
    }
  }, []);

  return (
    <div>
      <h1>Leaderboard dashboard</h1>
      <p>Here is this week's leaderboards for your group.</p>
      <Markdown>{leaderboard}</Markdown>
    </div>
  );
}
