import { MessageEmbed } from "discord.js";
import { BotInt } from "../interfaces/BotInt";
import { TicketDetailsInt } from "../interfaces/TicketDetailsInt";
import { errorHandler } from "../utils/errorHandler";

export const ticketClaimLog = async (
  Bot: BotInt,
  details: TicketDetailsInt
): Promise<void> => {
  try {
    const ticketClaimEmbed = new MessageEmbed();
    ticketClaimEmbed.setColor("YELLOW");
    ticketClaimEmbed.setTitle("Ticket Claimed");
    ticketClaimEmbed.setDescription(
      `${details.name} claimed by ${details.claimed}`
    );

    await Bot.logHook.send({ embeds: [ticketClaimEmbed] });
  } catch (err) {
    errorHandler("ticket create log", err);
  }
};
