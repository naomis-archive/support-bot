import {
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from "discord.js";

import { ButtonHandler } from "../../interfaces/ButtonHandler";
import { errorHandler } from "../../utils/errorHandler";

/* eslint-disable-next-line jsdoc/require-jsdoc */
export const ticketHandler: ButtonHandler = async (Bot, interaction) => {
  try {
    const ticketModal = new Modal()
      .setCustomId("ticket-modal")
      .setTitle("Naomi's Ticket System");
    const reasonInput = new TextInputComponent()
      .setCustomId("reason")
      .setLabel("Why are you opening this ticket?")
      .setStyle("PARAGRAPH")
      .setRequired(true);

    const actionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        reasonInput
      );
    ticketModal.addComponents(actionRow);
    await interaction.showModal(ticketModal);
  } catch (err) {
    await errorHandler("ticket handler", err);
  }
};
