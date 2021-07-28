import { MessageEmbed } from "discord.js";
import { TicketTypes } from "../../config/TicketTypes";
import { CommandInt } from "../../interfaces/CommandInt";
import { ticketCreateLog } from "../../logs/ticketCreateLog";
import { errorHandler } from "../../utils/errorHandler";

export const ticket: CommandInt = {
  name: "ticket",
  run: async (Bot, message) => {
    try {
      const [, type, project, ...description] = message.content.split(/\s+/);

      if (!message.guild) {
        return;
      }

      if (!type || !TicketTypes.includes(type)) {
        await message.channel.send(
          "That is not a valid ticket type. Valid types are:\n" +
            TicketTypes.join(", ")
        );
        return;
      }

      const ticketEmbed = new MessageEmbed();
      ticketEmbed.setColor("GREEN");
      ticketEmbed.setTitle(`${message.author.username}'s Ticket`);
      ticketEmbed.addField("Ticket Type", type, true);
      ticketEmbed.addField("Related project", project, true);
      ticketEmbed.setDescription(description.join(" "));
      ticketEmbed.addField("User ID", message.author.id, true);
      ticketEmbed.addField("Claimed by:", "none", true);

      const ticketThread = await message.startThread(
        `ticket-${message.author.username}`,
        1440
      );

      await ticketThread.send({ embeds: [ticketEmbed] });
      await message.delete();
      await ticketCreateLog(Bot, {
        type,
        project,
        name: ticketThread.name,
        user: `<@!${message.author.id}>`,
        details: description.join(" "),
        claimed: "none",
        resolution: "none",
        resolved: false,
      });
    } catch (err) {
      errorHandler("ticket command", err);
    }
  },
};
