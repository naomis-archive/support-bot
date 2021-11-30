import { readFile, unlink } from "fs/promises";
import { join } from "path";

import { MessageAttachment } from "discord.js";

import { BotInt } from "../interfaces/BotInt";
import { errorHandler } from "../utils/errorHandler";

/**
 * To run when a ticket is closed. Finds the ticket log file,
 * creates a message attachement with the logs, and deletes the file.
 *
 * @param {BotInt} Bot The bot's Discord instance.
 * @param {string} channelId The channel ID of the ticket.
 * @returns {Promise<MessageAttachment>} The log file as a Discord attachment.
 */
export const generateLogs = async (
  Bot: BotInt,
  channelId: string
): Promise<MessageAttachment> => {
  try {
    const logName = Bot.ticketLogs[channelId];
    delete Bot.ticketLogs[channelId];

    const logs = await readFile(
      join(process.cwd(), "logs", `${logName}.txt`),
      "utf8"
    ).catch(() => "no logs found...");

    const attachment = new MessageAttachment(
      Buffer.from(logs, "utf-8"),
      "log.txt"
    );

    await unlink(join(process.cwd(), "logs", `${logName}.txt`));

    return attachment;
  } catch (err) {
    errorHandler("log generator", err);
    return new MessageAttachment(
      Buffer.from("An error occurred fetching these logs.", "utf-8"),
      "log.txt"
    );
  }
};
