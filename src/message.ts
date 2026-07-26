import { getWelcomeMessages, setWelcome } from "./join";

const hello = async (roomId: string) => {
  const welcomeMessages = await getWelcomeMessages(roomId);

  const responses = [];

  if (welcomeMessages.group_message && welcomeMessages.group_message !== "") {
    responses.push({
      message: `Quote reply to this message to edit the group welcome message. The message is currently: ${welcomeMessages.group_message}`,
      context: {
        welcomeWaking: true,
        directWelcome: false
      }
    })
  }
  else {
    responses.push({
      message: `There is no welcome message sent to the group when new members join. Quote reply to this message to set a new group welcome message.`,
      context: {
        welcomeWaking: true,
        directWelcome: false
      }
    })
  }

  /*
  if (welcomeMessages.direct_message && welcomeMessages.direct_message !== "") {
    responses.push({
      message: `Quote reply to this message to edit the welcome message sent directly to new group members. The message is currently: ${welcomeMessages.direct_message}`,
      context: {
        welcomeWaking: true,
        directWelcome: true
      }
    })
  }
  else {
    responses.push({
      message: `There is no welcome message sent directly to new group members. Quote reply to this message to set a new group welcome message.`,
      context: {
        welcomeWaking: true,
        directWelcome: true
      }
    })
  }
    */

  return responses;
};

const handleReply = async (event, botUserId) => {
  const roomId = event.room_id;
  const message = event.content.body;
  const replyText = message.split("\n\n")[1] || message;
  const prevEvent = event.prevEvent;

  if (prevEvent.sender !== botUserId) return;

  if (!prevEvent.content.context.welcomeWaking) return;

  return setWelcome(roomId, replyText, prevEvent.content.context.directWelcome);
};

const handleMessage = async (event, botUserId) => {
  const message = event.content.body.toLowerCase();

  //if message is a reply, handle reply
  if (event.content["m.relates_to"]) {
    return handleReply(event, botUserId);;
  }

  //if message has the tool's wake word, say hello
  if (message.includes("!welcome")) {
    return hello(event.room_id);
  }
};

export default handleMessage;
