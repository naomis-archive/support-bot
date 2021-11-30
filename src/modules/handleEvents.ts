import { onInteractionCreate } from "../events/onInteractionCreate";
import { onMessage } from "../events/onMessage";
import { onReady } from "../events/onReady";
import { BotInt } from "../interfaces/BotInt";

/**
 * Registers the Discord event listeners.
 *
 * @param {BotInt} Bot The bot instance.
 */
export const handleEvents = (Bot: BotInt): void => {
  Bot.on(
    "interactionCreate",
    async (interaction) => await onInteractionCreate(Bot, interaction)
  );

  Bot.on("messageCreate", async (message) => await onMessage(Bot, message));

  Bot.on("ready", async () => await onReady(Bot));
};
