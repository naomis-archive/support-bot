import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { generateLogs } from "../../modules/generateLogs";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles closing a ticket.
 */
export const closeHandler: ButtonHandler = async (Bot, interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, member, channel } = interaction;

    if (!guild || !member || !channel) {
      await interaction.editReply({
        content: "Error finding the guild!",
      });
      return;
    }

    const supportRole = await guild.roles.fetch(Bot.supportRole);

    if (!supportRole) {
      await interaction.editReply("Cannot find support role!");
      return;
    }

    const isSupport = (member as GuildMember).roles.cache.has(supportRole.id);

    if (!isSupport && member.user.id !== Bot.botOwner) {
      await interaction.editReply({
        content: "Only support members can close a ticket.",
      });
      return;
    }

    const logEmbed = new EmbedBuilder();
    logEmbed.setTitle("Ticket Closed");
    logEmbed.setDescription(`Ticket closed by <@!${member.user.id}>`);
    logEmbed.addFields({
      name: "User",
      value:
        (channel as TextChannel)?.name.split("-").slice(1).join("-") ||
        "unknown",
    });

    const logFile = await generateLogs(Bot, channel.id);
    await Bot.logHook.send({ embeds: [logEmbed], files: [logFile] });
    await channel.delete();
  } catch (err) {
    await errorHandler("close handler", err);
  }
};
