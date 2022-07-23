import { Colors, EmbedBuilder } from "discord.js";

import { BotInt } from "../interfaces/BotInt";
import { TicketDetailsInt } from "../interfaces/TicketDetailsInt";
import { errorHandler } from "../utils/errorHandler";

/**
 * Sends a log when a ticket is claimed.
 *
 * @param {BotInt} Bot The bot instance.
 * @param {TicketDetailsInt} details The details of the claimed ticket.
 */
export const ticketClaimLog = async (
  Bot: BotInt,
  details: TicketDetailsInt
): Promise<void> => {
  try {
    const ticketClaimEmbed = new EmbedBuilder();
    ticketClaimEmbed.setColor(Colors.Yellow);
    ticketClaimEmbed.setTitle("Ticket Claimed");
    ticketClaimEmbed.setDescription(
      `${details.name} claimed by ${details.claimed}`
    );

    await Bot.logHook.send({ embeds: [ticketClaimEmbed] });
  } catch (err) {
    await errorHandler("ticket create log", err);
  }
};
