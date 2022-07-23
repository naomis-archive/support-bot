import { Colors, EmbedBuilder } from "discord.js";

import { BotInt } from "../interfaces/BotInt";
import { TicketDetailsInt } from "../interfaces/TicketDetailsInt";
import { errorHandler } from "../utils/errorHandler";

/**
 * Sends a log when a ticket is closed.
 *
 * @param {BotInt} Bot The bot instance.
 * @param {TicketDetailsInt} details The details of the closed ticket.
 */
export const ticketCloseLog = async (
  Bot: BotInt,
  details: TicketDetailsInt
): Promise<void> => {
  try {
    const ticketCloseEmbed = new EmbedBuilder();
    ticketCloseEmbed.setColor(
      details.resolved ? Colors.DarkGreen : Colors.DarkRed
    );
    ticketCloseEmbed.setTitle("Ticket Closed");
    ticketCloseEmbed.setDescription(`${details.name} has been closed.`);
    ticketCloseEmbed.addFields([
      { name: "Claimed by:", value: details.claimed, inline: true },
      { name: "Resolved:", value: String(details.resolved), inline: true },
      { name: "Resolution:", value: details.resolution, inline: true },
    ]);

    await Bot.logHook.send({ embeds: [ticketCloseEmbed] });
  } catch (err) {
    await errorHandler("ticket create log", err);
  }
};
