import { MessageEmbed } from "discord.js";
import { BotInt } from "../interfaces/BotInt";
import { TicketDetailsInt } from "../interfaces/TicketDetailsInt";
import { errorHandler } from "../utils/errorHandler";

export const ticketCloseLog = async (
  Bot: BotInt,
  details: TicketDetailsInt
): Promise<void> => {
  try {
    const ticketCloseEmbed = new MessageEmbed();
    ticketCloseEmbed.setColor(details.resolved ? "DARK_GREEN" : "DARK_RED");
    ticketCloseEmbed.setTitle("Ticket Closed");
    ticketCloseEmbed.setDescription(`${details.name} has been closed.`);
    ticketCloseEmbed.addField("Closed by:", details.claimed, true);
    ticketCloseEmbed.addField("Resolved?", `${details.resolved}`, true);
    ticketCloseEmbed.addField("Resolution:", details.resolution);

    await Bot.logHook.send({ embeds: [ticketCloseEmbed] });
  } catch (err) {
    errorHandler("ticket create log", err);
  }
};
