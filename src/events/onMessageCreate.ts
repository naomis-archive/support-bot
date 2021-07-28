import { Message } from "discord.js";
import { CommandList } from "../commands/CommandList";
import { BotInt } from "../interfaces/BotInt";

export const onMessageCreate = async (
  Bot: BotInt,
  message: Message
): Promise<void> => {
  if (message.author.bot) {
    return;
  }

  if (!message.content.startsWith("^")) {
    return;
  }

  for (const Command of CommandList) {
    if (message.content.toLowerCase().startsWith(`^${Command.name}`)) {
      await Command.run(Bot, message);
      break;
    }
  }
};
