import { Interaction } from "discord.js";
import { CommandList } from "../commands/CommandList";
import { BotInt } from "../interfaces/BotInt";

export const onInteractionCreate = async (
  Bot: BotInt,
  interaction: Interaction
): Promise<void> => {
  if (interaction.isCommand()) {
    for (const Command of CommandList) {
      if (interaction.commandName === Command.data.name) {
        await Command.run(Bot, interaction);
        break;
      }
    }
  }
};
