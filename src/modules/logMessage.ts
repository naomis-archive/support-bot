import { readFile, writeFile } from "fs/promises";
import { join } from "path";

import { Message } from "discord.js";

import { BotInt } from "../interfaces/BotInt";
import { errorHandler } from "../utils/errorHandler";

/**
 * Logs messages to a file to track ticket activity.
 *
 * @param {BotInt} Bot The bot's Discord instance.
 * @param {Message} message The Discord message payload.
 * @param {string} logId The logId to identify the file.
 */
export const logMessage = async (
  Bot: BotInt,
  message: Message,
  logId: string
): Promise<void> => {
  try {
    const logFile = await readFile(
      join(process.cwd(), "logs", `${logId}.txt`),
      "utf8"
    );

    const parsedString = `[${new Date(
      message.createdTimestamp
    ).toLocaleString()}] - ${message.author.tag}: ${message.content}\n`;

    await writeFile(
      join(process.cwd(), "logs", `${logId}.txt`),
      logFile + parsedString
    );
  } catch (err) {
    await errorHandler("message logger", err);
  }
};
