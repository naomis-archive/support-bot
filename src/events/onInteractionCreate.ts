import { Interaction } from "discord.js";

import { CommandList } from "../commands/CommandList";
import { claimHandler } from "../commands/tickets/claim";
import { closeHandler } from "../commands/tickets/close";
import { ticketHandler } from "../commands/tickets/ticket";
import { ticketModal } from "../commands/tickets/ticketModal";
import { BotInt } from "../interfaces/BotInt";

/**
 * Listens to the INTERACTION_CREATE event and handles slash commands
 * and button clicks.
 *
 * @param {BotInt} Bot The bot instance.
 * @param {Interaction} interaction The interaction object.
 */
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

  if (interaction.isModalSubmit()) {
    await ticketModal(Bot, interaction);
  }

  if (interaction.isButton()) {
    const id = interaction.customId;
    switch (id) {
      case "ticket":
        await ticketHandler(Bot, interaction);
        return;
      case "claim":
        await claimHandler(Bot, interaction);
        return;
      case "close":
        await closeHandler(Bot, interaction);
        return;
    }
  }
};
