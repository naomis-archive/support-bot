import {
  ActionRowBuilder,
  ModalBuilder,
  ModalActionRowComponentBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

export const ticketHandler: ButtonHandler = async (Bot, interaction) => {
  try {
    const ticketModal = new ModalBuilder()
      .setCustomId("ticket-modal")
      .setTitle("Naomi's Ticket System");
    const reasonInput = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Why are you opening this ticket?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const actionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        reasonInput
      );
    ticketModal.addComponents(actionRow);
    await interaction.showModal(ticketModal);
  } catch (err) {
    await errorHandler("ticket handler", err);
  }
};
