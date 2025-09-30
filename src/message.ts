import { PERSON_NAME, ROLE_NAME } from "./constants";

const hello = async () => {
  return {
    message: `🤖Welcome Tool🤖: Hello I'm the matrix example tool. 
    I track who has been assigned roles in this group. 
    React to this message with:\n
    ❤️ to see the current assigned roles\n
    👍 to assign a role to someone`};
};

const sendPersonRequest = (replyText: string) => {
  return {
    message: `Quote-reply to this message with the name of the role you want to assign to ${replyText}.`,
    context: {
      person: {
        name: replyText,
      },
      expecting: ROLE_NAME,
    }
  }
};


const handleReply = async (event, botUserId) => {
  const roomId = event.room_id;
  const message = event.content.body;
  const replyText = message.split("\n\n")[1] || message;
  const prevEvent = event.prevEvent;

  if (prevEvent.sender !== botUserId) return;

  const { expecting } = prevEvent.content.context;

  if (expecting === PERSON_NAME) {
    return sendPersonRequest(replyText);
  }
};

const handleMessage = async (event, botUserId) => {
  const message = event.content.body.toLowerCase();

  //if message is a reply, handle reply
  if (event.content["m.relates_to"]) {
    return handleReply(event, botUserId);;
  }

  //if message has the tool's wake word, say hello
  if (message.includes("!welcome")) {
    return hello();
  }
};

export default handleMessage;
