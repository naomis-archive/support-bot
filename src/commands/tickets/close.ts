import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  TextChannel,
} from "discord.js";

import { BotInt } from "../../interfaces/BotInt";
import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles closing a ticket.
 *
 * @param {BotInt} Bot The bot instance.
 * @param {CommandInteraction} interaction The resulting interaction from clicking the close button.
 */
export const closeHandler: ButtonHandler = async (Bot, interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, member, channel } = interaction;

    if (!guild || !member) {
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

    const logEmbed = new MessageEmbed();
    logEmbed.setTitle("Ticket Closed");
    logEmbed.setDescription(`Ticket closed by <@!${member.user.id}>`);
    logEmbed.addField(
      "User",
      (channel as TextChannel)?.name.split("-").slice(1).join("-") || "unknown"
    );
    await Bot.logHook.send({ embeds: [logEmbed] });
    await interaction.channel?.delete();
  } catch (err) {
    errorHandler("close handler", err);
  }
};
