import { getWelcomeMessageForRoomId, insertWelcomeMessage, updateWelcomeMessage } from "./duckdb";

export const getWelcomeMessages = async (roomId: string) => {
  const welcome = await getWelcomeMessageForRoomId(roomId);

  return welcome || { group_message: "", direct_message: "" };
}

export const setWelcome = async (roomId: string, welcomeMessage: string, directWelcome: boolean) => {
  const existingWelcomeMessage = await getWelcomeMessageForRoomId(roomId);

  if (existingWelcomeMessage) {
    await updateWelcomeMessage(roomId, welcomeMessage, directWelcome);
  }
  else {
    await insertWelcomeMessage(roomId, welcomeMessage, directWelcome);
  }

  return {
    message: `The ${directWelcome ? "individual" : "group"} welcome message is now: ${welcomeMessage}`
  }
};

const handleJoin = async (event) => {
  const welcomeMessages = await getWelcomeMessages(event.room_id);

  const responses = [];

  if (welcomeMessages.direct_message && welcomeMessages.direct_message !== "") {
    responses.push({
      message: welcomeMessages.direct_message,
      context: {
        welcomeWaking: false
      },
      recipient: event.sender
    })
  }

  if (welcomeMessages.group_message && welcomeMessages.group_message !== "") {
    responses.push({
      message: welcomeMessages.group_message,
      context: {
        welcomeWaking: false
      }
    })
  }

  return responses;
};

export default handleJoin;
