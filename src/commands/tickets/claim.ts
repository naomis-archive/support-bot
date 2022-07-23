/* eslint-disable jsdoc/require-param */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  GuildMember,
  Message,
} from "discord.js";

import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Handles the process of claiming a ticket.
 */
export const claimHandler: ButtonHandler = async (Bot, interaction) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, message, member } = interaction;
    const { embeds } = message;

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
        content: "Only support members can claim a ticket.",
      });
      return;
    }

    const ticketEmbed = embeds[0] as Embed;
    const updatedEmbed = {
      ...ticketEmbed,
      fields: [{ name: "Claimed by:", value: `<@${member.user.id}>` }],
    };

    const claimButton = new ButtonBuilder()
      .setCustomId("claim")
      .setStyle(ButtonStyle.Success)
      .setLabel("Claim this ticket!")
      .setEmoji("✋")
      .setDisabled(true);
    const closeButton = new ButtonBuilder()
      .setCustomId("close")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Close this ticket!")
      .setEmoji("🗑️");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      claimButton,
      closeButton,
    ]);

    await (message as Message).edit({
      embeds: [updatedEmbed],
      components: [row],
    });

    await interaction.editReply("You have been assigned this ticket.");
  } catch (err) {
    await errorHandler("claim handler", err);
  }
};
