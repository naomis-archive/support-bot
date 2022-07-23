import { Colors, EmbedBuilder } from "discord.js";

import { BotInt } from "../interfaces/BotInt";
import { TicketDetailsInt } from "../interfaces/TicketDetailsInt";
import { errorHandler } from "../utils/errorHandler";

/**
 * Sends a log when a ticket is created.
 *
 * @param {BotInt} Bot The bot instance.
 * @param {TicketDetailsInt} details The details of the created ticket.
 */
export const ticketCreateLog = async (
  Bot: BotInt,
  details: TicketDetailsInt
): Promise<void> => {
  try {
    const ticketCreateEmbed = new EmbedBuilder();
    ticketCreateEmbed.setColor(Colors.Yellow);
    ticketCreateEmbed.setTitle("Ticket Created");
    ticketCreateEmbed.setDescription(details.details);
    ticketCreateEmbed.addFields([
      { name: "Type", value: details.type, inline: true },
      { name: "Project", value: details.project, inline: true },
      { name: "User", value: details.user, inline: true },
    ]);

    await Bot.logHook.send({ embeds: [ticketCreateEmbed] });
  } catch (err) {
    await errorHandler("ticket create log", err);
  }
};
