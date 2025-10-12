import { getWelcomeMessage, setWelcome } from "./join";

const hello = async (roomId: string) => {
  const welcomeMessage = await getWelcomeMessage(roomId);

  return {
    message: `🤖Welcome Tool🤖: Hello I'm the welcome tool. \n\nI say "${welcomeMessage}" to anyone new joining this group. Reply to this message to update the welcome message`,
    context: {
      welcomeWaking: true
    }
  };
};

const handleReply = async (event, botUserId) => {
  const roomId = event.room_id;
  const message = event.content.body;
  const replyText = message.split("\n\n")[1] || message;
  const prevEvent = event.prevEvent;

  if (prevEvent.sender !== botUserId) return;

  if (!prevEvent.content.context.welcomeWaking) return;

  return setWelcome(roomId, replyText);
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
