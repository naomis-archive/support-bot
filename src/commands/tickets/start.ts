import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandInt } from "../../interfaces/CommandInt";
import { errorHandler } from "../../utils/errorHandler";

export const start: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Creates the ticket system instruction post."),
  // eslint-disable-next-line jsdoc/require-jsdoc
  run: async (Bot, interaction) => {
    try {
      if (interaction.user.id !== Bot.botOwner) {
        await interaction.reply({
          content: "Only nhcarrigan can use this!",
          ephemeral: true,
        });
        return;
      }
      const embed = new EmbedBuilder();
      embed.setTitle("Need Help?");
      embed.setDescription(
        "If you need help with one of our projects, and you want to speak with our support team privately, you can open a ticket!\n\nClick the button below to open a private ticket with the support team."
      );
      embed.setColor("#0099ff");

      const button = new ButtonBuilder()
        .setLabel("Open a Ticket!")
        .setEmoji("❔")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("ticket");

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      await interaction.reply({ embeds: [embed], components: [row] });
    } catch (err) {
      await errorHandler("start", err);
    }
  },
};
