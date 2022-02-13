import * as Sentry from "@sentry/node";
import { MessageEmbed, WebhookClient } from "discord.js";

import { logHandler } from "./logHandler";

/**
 * Standard error handling module to pipe errors to Sentry and
 * format the error for logging.
 *
 * @param {string} context A description of where the error occurred.
 * @param {any} error The error object.
 */
export const errorHandler = async (context: string, error: unknown) => {
  const parsed = error as Error;
  logHandler.log("error", `There was an error in the ${context}:`);
  logHandler.log(
    "error",
    JSON.stringify({ errorMessage: parsed.message, errorStack: parsed.stack })
  );
  Sentry.captureException(error);

  const hook = new WebhookClient({ url: process.env.DEBUG_HOOK as string });

  const embed = new MessageEmbed();
  embed.setTitle(`There was an error in the ${context}`);
  embed.setDescription(parsed.message.slice(0, 2000));
  embed.addField(
    "Stack",
    `\`\`\`${parsed.stack?.slice(0, 1000) || "no stack"}\`\`\``
  );

  await hook.send({ embeds: [embed] });
};
