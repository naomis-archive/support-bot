import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  GuildChannelCreateOptions,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";

import { BotInt } from "../../interfaces/BotInt";
import { createLogFile } from "../../modules/createLogFile";

/**
 * Handles responding to the ticket modal.
 *
 * @param {BotInt} Bot The bot's discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const ticketModal = async (
  Bot: BotInt,
  interaction: ModalSubmitInteraction
) => {
  await interaction.deferReply({ ephemeral: true });
  const { guild, user } = interaction;
  const reason = interaction.fields.getTextInputValue("reason");

  if (!guild) {
    await interaction.editReply("Guild record error.");
    return;
  }

  const ticketCategory = await guild.channels.fetch(Bot.category);

  if (!ticketCategory || ticketCategory.type !== ChannelType.GuildCategory) {
    await interaction.editReply("Cannot find ticket category!");
    return;
  }

  const supportRole = await guild.roles.fetch(Bot.supportRole);

  if (!supportRole) {
    await interaction.editReply("Cannot find support role!");
    return;
  }

  const options: GuildChannelCreateOptions = {
    parent: ticketCategory.id,
    name: `ticket-${user.username}`,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      },
      {
        id: user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      },
      {
        id: supportRole.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      },
      {
        id: Bot.user?.id || "oh no",
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ],
      },
    ],
  };

  const ticketChannel = (await guild.channels.create(options)) as TextChannel;

  const claimButton = new ButtonBuilder()
    .setCustomId("claim")
    .setStyle(ButtonStyle.Success)
    .setLabel("Claim this ticket!")
    .setEmoji("✋");
  const closeButton = new ButtonBuilder()
    .setCustomId("close")
    .setStyle(ButtonStyle.Danger)
    .setLabel("Close this ticket!")
    .setEmoji("🗑️");

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
    claimButton,
    closeButton,
  ]);

  const ticketEmbed = new EmbedBuilder();
  ticketEmbed.setTitle("Ticket Created");
  ticketEmbed.setDescription(`<@!${user.id}> opened a ticket for:\n${reason}`);

  await createLogFile(Bot, ticketChannel.id, user.tag, reason);

  await ticketChannel.send({ embeds: [ticketEmbed], components: [row] });
  await interaction.editReply(
    "Your ticket channel has been created! Please head there and describe the issue you are having."
  );
};
