import "./App.css";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getWelcomeMessage, postWelcome } from "./requests";

export default function App() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [currentWelcome, setCurrentWelcome] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  async function loadWelcome(roomId: string) {
    const welcomeMessage = await getWelcomeMessage(roomId);
    console.log(welcomeMessage);
    setCurrentWelcome(welcomeMessage);
    setWelcomeMessage(welcomeMessage);
  }

  useEffect(() => {
    if (roomId) {
      loadWelcome(roomId);
    }
  }, []);

  async function updateWelcome() {
    if (roomId) {
      await postWelcome(roomId, welcomeMessage);
      loadWelcome(roomId);
    }
  }

  return (
    <div>
      <h1>Welcome Tool dashboard</h1>
      <p>Use the text box below to set the auto-welcome for your group.</p>
      <p>The current welcome is:</p>
      <p>{currentWelcome}</p>
      <div>
        <textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
        ></textarea>
        <button onClick={updateWelcome}>Update</button>
      </div>
    </div>
  );
}
