import {
  GuildChannelCreateOptions,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  ModalSubmitInteraction,
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

  if (!ticketCategory || ticketCategory.type !== "GUILD_CATEGORY") {
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
    type: "GUILD_TEXT",
    permissionOverwrites: [
      {
        id: guild.id,
        deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
      },
      {
        id: user.id,
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
      },
      {
        id: supportRole.id,
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
      },
      {
        id: Bot.user?.id || "oh no",
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
      },
    ],
  };

  const ticketChannel = (await guild.channels.create(
    `ticket-${user.username}`,
    options
  )) as TextChannel;

  const claimButton = new MessageButton()
    .setCustomId("claim")
    .setStyle("SUCCESS")
    .setLabel("Claim this ticket!")
    .setEmoji("✋");
  const closeButton = new MessageButton()
    .setCustomId("close")
    .setStyle("DANGER")
    .setLabel("Close this ticket!")
    .setEmoji("🗑️");

  const row = new MessageActionRow().addComponents([claimButton, closeButton]);

  const ticketEmbed = new MessageEmbed();
  ticketEmbed.setTitle("Ticket Created");
  ticketEmbed.setDescription(`<@!${user.id}> opened a ticket for:\n${reason}`);

  await createLogFile(Bot, ticketChannel.id);

  await ticketChannel.send({ embeds: [ticketEmbed], components: [row] });
  await interaction.editReply(
    "Your ticket channel has been created! Please head there and describe the issue you are having."
  );
};
