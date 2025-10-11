import { getWelcomeMessageForRoomId, insertWelcomeMessage, updateWelcomeMessage } from "./duckdb";

export const getWelcomeMessage = async (roomId: string) => {
  const welcome = await getWelcomeMessageForRoomId(roomId) || { message: "Welcome!" };

  return welcome.message;
}

export const setWelcome = async (roomId: string, welcomeMessage: string) => {
  const existingWelcomeMessage = await getWelcomeMessageForRoomId(roomId);

  if (existingWelcomeMessage) {
    await updateWelcomeMessage(roomId, welcomeMessage);
  }
  else {
    await insertWelcomeMessage(roomId, welcomeMessage);
  }

  return {
    message: `Great, I've set the welcome message to: ${welcomeMessage}`
  }
};

const handleJoin = async (event) => {
  const welcomeMessage = await getWelcomeMessage(event.room_id);

  return { message: `🤖Welcome Tool🤖: ${welcomeMessage}` };
};

export default handleJoin;
