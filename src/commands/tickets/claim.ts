import { CommandInt } from "../../interfaces/CommandInt";
import { ticketClaimLog } from "../../logs/ticketClaimLog";
import { errorHandler } from "../../utils/errorHandler";

export const claim: CommandInt = {
  name: "claim",
  run: async (Bot, message) => {
    try {
      if (!message.guild) {
        return;
      }

      if (
        message.channel.type !== "GUILD_PUBLIC_THREAD" ||
        !message.channel.name.startsWith("ticket")
      ) {
        await message.channel.send("You can only do this in ticket channels.");
        return;
      }
      await message.guild.roles.fetch();

      const supportRole = message.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === "advisor"
      );

      if (!supportRole) {
        await message.channel.send("I cannot find your support role");
        return;
      }

      const authorIsSupport = message.member?.roles.cache.has(
        `${supportRole.id}`
      );

      if (!authorIsSupport) {
        await message.channel.send("Only support members can claim tickets.");
        return;
      }

      const ticketEmbedMessage = (await message.channel.messages.fetch())
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map((el) => el)[1];

      if (!ticketEmbedMessage || !ticketEmbedMessage.embeds.length) {
        await message.channel.send("I cannot find the ticket embed.");
      }

      const ticketEmbed = ticketEmbedMessage.embeds[0];

      const claimed = ticketEmbed.fields.find(
        (el) => el.name === "Claimed by:"
      );

      if (!claimed || claimed?.value !== "none") {
        await message.channel.send("This ticket has already been claimed!");
        return;
      }

      claimed.value = `<@!${message.author.id}>`;

      await ticketEmbedMessage.edit({ embeds: [ticketEmbed] });
      await message.delete();
      await ticketClaimLog(Bot, {
        type: "",
        name: message.channel.name,
        project: "",
        user: `${message.author.id}`,
        details: "",
        claimed: `<@!${message.author.id}>`,
        resolution: "none",
        resolved: false,
      });
    } catch (err) {
      errorHandler("claim", err);
    }
  },
};
