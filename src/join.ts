import { PERSON_NAME } from "./constants";
import { getPseudoState, setPseudoState } from "./pseudoState";

const showAssignedRoles = async (roomId: string) => {
  const messages = [];
  messages.push({ message: "Here are the current people with roles:" });

  const roleState = await getPseudoState(roomId);

  if (!roleState || !roleState.assignedRoles || roleState.assignedRoles.length === 0) {
    messages.push({ message: "There are no roles currently assigned." });
    return messages;
  }

  roleState.assignedRoles.forEach((assignedRole) => {
    messages.push({
      message: `${assignedRole.person.name} has the role ${assignedRole.role.name}. React with 🙏 to remove this role`,
      context: { ...assignedRole }
    }
    );
  });

  return messages;
};

export const setWelcome = async (roomId: string, welcomeMessage: string) => {
  return {
    message: "You're assigning a role. Quote-reply to this message with the name of the person receiving the role.",
    context: {
      expecting: PERSON_NAME,
    }
  };
};

export const removeRole = async (roomId: string, roleId: string) => {
  const roleState = await getPseudoState(roomId);

  if (!roleState) {
    return;
  }

  const roleToRemove = roleState.assignedRoles.find(
    assignedRole => assignedRole.id === roleId
  );

  if (!roleToRemove) {
    return;
  }

  const remainingRoles = roleState.assignedRoles.filter(
    (assignedRole) => assignedRole.id !== roleToRemove.id
  );

  setPseudoState(roomId, {
    assignedRoles: remainingRoles,
  });

  return { message: `You have removed the role ${roleToRemove.role.name} from ${roleToRemove.person.name}` };
};

const handleJoin = async (event, botUserId) => {
  const welcomeMessage = `hello there`
  //reaction not recognised
  return `🤖Welcome Tool🤖: ${welcomeMessage}`
};

export default handleJoin;
