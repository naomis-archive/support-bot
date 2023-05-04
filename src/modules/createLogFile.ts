import { writeFile } from "fs/promises";
import { join } from "path";

import { BotInt } from "../interfaces/BotInt";
import { errorHandler } from "../utils/errorHandler";

/**
 * Creates the initial ticket log file.
 *
 * @param {BotInt} Bot The bot's Discord instance.
 * @param {string} channelId The ticket channel ID, used as a unique identifier.
 * @param {string} user The user tag of the person who opened the ticket.
 * @param {string} content The initial content of the log file.
 */
export const createLogFile = async (
  Bot: BotInt,
  channelId: string,
  user: string,
  content: string
): Promise<void> => {
  try {
    Bot.ticketLogs[channelId] = channelId;

    await writeFile(
      join(process.cwd(), "logs", `${channelId}.txt`),
      `[${new Date().toLocaleString()}] - **TICKET CREATED**\n${content}\n[${new Date().toLocaleString()}] - ${user}: ${content}\n`
    );
  } catch (err) {
    await errorHandler("log file creation", err);
  }
};
