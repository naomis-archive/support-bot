import { Message } from "discord.js";

import { BotInt } from "../interfaces/BotInt";
import { logMessage } from "../modules/logMessage";
import { errorHandler } from "../utils/errorHandler";

/**
 * Handles the message create event from Discord, checks if the message is in
 * an active ticket, and if so, log it.
 *
 * @param {BotInt} Bot The bot's Discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const onMessage = async (
  Bot: BotInt,
  message: Message
): Promise<void> => {
  try {
    if (message.author.bot) {
      return;
    }
    const id = message.channelId;

    if (!Bot.ticketLogs[id]) {
      return;
    }

    await logMessage(Bot, message, Bot.ticketLogs[id]);
  } catch (err) {
    errorHandler("message event", err);
  }
};
