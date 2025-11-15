import { getLinksForRoomId, insertLink } from "./duckdb";
import { moduleRegistration } from "./index";

const cleanName = (name: string) => {
  return name.replace("@", "").split(":")[0];
}

const getLeaderboard = async (roomId: string) => {

  const links = await getLinksForRoomId(roomId);
  console.log(links);
  const people = []
  links.forEach(link => {
    const sender = cleanName(link.sender as string);
    if (!people.find(person => person.name === sender)) {
      people.push({name: sender, links: 1})
    } else {
      people.find(person => person.name === sender).links++
    }
  })
  

  return `This week's leaderboard!⭐

${people.sort((a, b) => b.links - a.links).map(person => `${person.name} ${person.links} Links`).join("\n")}
`;
}

const hello = async (roomId: string) => {
  const leaderboard = await getLeaderboard(roomId);

  return {
    message: `Hello I'm the leaderboard tool⭐ \n\nI provide a leaderboard to track who shares the most links! ${leaderboard}`,
    context: {
      welcomeWaking: true
    }
  };
};

const processContent = async (message: string, sender: string, roomId: string) => {
  if (message.includes("https://")) {
    await insertLink(roomId, sender, message);
  }
}

const handleMessage = async (event, botUserId) => {
  const message = event.content.body.toLowerCase();

  processContent(message,event.sender,event.room_id);

  //if message has the tool's wake word, give the leaderboard
  if (message.includes(moduleRegistration.wake_word)) {
    return hello(event.room_id);
  }
};

export default handleMessage;
