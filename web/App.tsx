import "./App.css";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getToolState, postRole, deleteRole } from "./requests";
import { type State } from "../types";

export default function App() {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get("roomId");
    const [toolState, setToolState] = useState<State>();
    async function loadToolState(roomId: string) {
        const toolState = await getToolState(roomId);
        console.log(toolState)
        setToolState(toolState);
    }

    useEffect(() => {
        if (roomId) {
            loadToolState(roomId);
        }
    }, [])

    async function postWelcome() {
        if (roomId) {
            loadToolState(roomId);
        }
    }

    return <div>
        <h1>Welcome Tool dashboard</h1>
        {toolState && <div>
            <textarea value={toolState.message}></textarea>
            <button onClick={postWelcome}>Update</button>
        </div>
        }
    </div>
}