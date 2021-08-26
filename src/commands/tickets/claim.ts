import {
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

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

    if (
      !(member as GuildMember).roles.resolve(supportRole) &&
      member.user.id !== Bot.botOwner
    ) {
      await interaction.editReply({
        content: "Only support members can claim a ticket.",
      });
      return;
    }

    const ticketEmbed = embeds[0] as MessageEmbed;
    ticketEmbed.setFields([
      {
        name: "Claimed by:",
        value: `<@${member.user.id}>`,
      },
    ]);

    const claimButton = new MessageButton()
      .setCustomId("claim")
      .setStyle("SUCCESS")
      .setLabel("Claim this ticket!")
      .setEmoji("✋")
      .setDisabled(true);
    const closeButton = new MessageButton()
      .setCustomId("close")
      .setStyle("DANGER")
      .setLabel("Close this ticket!")
      .setEmoji("🗑️");

    const row = new MessageActionRow().addComponents([
      claimButton,
      closeButton,
    ]);

    await (message as Message).edit({
      embeds: [ticketEmbed],
      components: [row],
    });

    await interaction.editReply("You have been assigned this ticket.");
  } catch (err) {
    errorHandler("claim handler", err);
  }
};
