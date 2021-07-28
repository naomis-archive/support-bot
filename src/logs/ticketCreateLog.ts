import { MessageEmbed } from "discord.js";
import { BotInt } from "../interfaces/BotInt";
import { TicketDetailsInt } from "../interfaces/TicketDetailsInt";
import { errorHandler } from "../utils/errorHandler";

export const ticketCreateLog = async (
  Bot: BotInt,
  details: TicketDetailsInt
): Promise<void> => {
  try {
    const ticketCreateEmbed = new MessageEmbed();
    ticketCreateEmbed.setColor("RED");
    ticketCreateEmbed.setTitle("Ticket Created");
    ticketCreateEmbed.setDescription(details.details);
    ticketCreateEmbed.addField("Type", details.type, true);
    ticketCreateEmbed.addField("Project", details.project, true);
    ticketCreateEmbed.addField("User", details.user, true);

    await Bot.logHook.send({ embeds: [ticketCreateEmbed] });
  } catch (err) {
    errorHandler("ticket create log", err);
  }
};
