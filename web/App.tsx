import "./App.css";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getWelcomeMessage, postWelcome } from "./requests";

export default function App() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [currentGroupWelcome, setCurrentGroupWelcome] = useState("");
  const [currentDirectWelcome, setCurrentDirectWelcome] = useState("");
  const [welcomeGroupMessage, setWelcomeGroupMessage] = useState("");
  const [welcomeDirectMessage, setWelcomeDirectMessage] = useState("");

  async function loadWelcome(roomId: string) {
    const welcomeMessage = await getWelcomeMessage(roomId);
    console.log(welcomeMessage);
    setCurrentGroupWelcome(welcomeMessage.group_message);
    setCurrentDirectWelcome(welcomeMessage.direct_message);
    setWelcomeGroupMessage(welcomeMessage.group_message);
    setWelcomeDirectMessage(welcomeMessage.direct_message);
  }

  useEffect(() => {
    if (roomId) {
      loadWelcome(roomId);
    }
  }, []);

  async function updateWelcome(directWelcome: boolean) {
    if (roomId) {
      await postWelcome(
        roomId,
        directWelcome ? welcomeDirectMessage : welcomeGroupMessage,
        directWelcome,
      );
      loadWelcome(roomId);
    }
  }

  return (
    <div>
      <h1>Welcome Tool dashboard</h1>
      <p>Use the text box below to set the auto-welcome for your group.</p>
      <p>The current group welcome is:</p>
      <p>{currentGroupWelcome}</p>
      <div>
        <textarea
          value={welcomeGroupMessage}
          onChange={(e) => setWelcomeGroupMessage(e.target.value)}
        ></textarea>
        <button onClick={() => updateWelcome(false)}>Update</button>
      </div>
      {/*
          <p>The current direct welcome is:</p>
      <p>{currentDirectWelcome}</p>
      <div>
        <textarea
          value={welcomeDirectMessage}
          onChange={(e) => setWelcomeDirectMessage(e.target.value)}
        ></textarea>
        <button onClick={() => updateWelcome(true)}>Update</button>
      </div>
        */}
    </div>
  );
}
