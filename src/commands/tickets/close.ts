import { MessageEmbed } from "discord.js";
import { CommandInt } from "../../interfaces/CommandInt";
import { ticketCloseLog } from "../../logs/ticketCloseLog";
import { errorHandler } from "../../utils/errorHandler";

export const close: CommandInt = {
  name: "close",
  run: async (Bot, message) => {
    try {
      if (!message.guild) {
        return;
      }

      const [, resolved, ...rawResolution] = message.content.split(/\s+/);

      if (resolved !== "true" && resolved !== "false") {
        await message.channel.send(
          "Please use `true` or `false` to tell me if the ticket was resolved."
        );
        return;
      }

      const resolution = rawResolution.join(" ");

      if (!resolution) {
        await message.channel.send("Please provide the resolution details");
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
        await message.channel.send("Only support members can close tickets.");
        return;
      }

      const ticketEmbedMessage = (await message.channel.messages.fetch())
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map((el) => el)[1];

      if (!ticketEmbedMessage || !ticketEmbedMessage.embeds.length) {
        await message.channel.send("I cannot find the ticket embed.");
      }

      const ticketEmbed = ticketEmbedMessage.embeds[0];

      const claimedId = ticketEmbed.fields.find(
        (el) => el.name === "Claimed by:"
      )?.value;

      let claimed = message.author.tag;

      if (claimedId && claimedId !== "none") {
        const claimedUser = await message.guild.members.fetch(
          `${BigInt(claimedId.replace(/\D/g, ""))}`
        );
        if (claimedUser) {
          claimed = claimedUser.user.tag;
        }
      }
      const description = ticketEmbed.description;
      const ticketOwnerId = ticketEmbed.fields.find(
        (el) => el.name === "User ID"
      )?.value;

      const closeEmbed = new MessageEmbed();
      closeEmbed.setTitle("Your ticket has been closed");
      closeEmbed.setDescription(description || "unknown");
      closeEmbed.addField("Resolution", resolution);
      closeEmbed.addField("Your Support Agent:", claimed, true);
      closeEmbed.addField("Ticket resolved?", resolved, true);
      closeEmbed.addField(
        "Provide Feedback?",
        "Please [share your experience](https://links.nhcarrigan.com/feedback) with our support system."
      );

      let sentDM = false;

      if (ticketOwnerId) {
        const ticketOwner = await message.guild.members.fetch(
          `${BigInt(ticketOwnerId)}`
        );
        if (ticketOwner) {
          sentDM = true;
          await ticketOwner
            .send({ embeds: [closeEmbed] })
            .catch(() => (sentDM = false));
        }
      }

      if (!sentDM) {
        await message.channel.send({ embeds: [closeEmbed] });
      }

      await message.channel.setArchived(true, resolution);

      await ticketCloseLog(Bot, {
        type: "",
        name: message.channel.name,
        project: "",
        user: "",
        details: "",
        claimed: `<@!${message.author.id}>`,
        resolution: resolution,
        resolved: resolved === "true" ? true : false,
      });
    } catch (err) {
      errorHandler("close", err);
    }
  },
};
