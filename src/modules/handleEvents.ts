import { onInteractionCreate } from "../events/onInteractionCreate";
import { onReady } from "../events/onReady";
import { BotInt } from "../interfaces/BotInt";

export const handleEvents = async (Bot: BotInt): Promise<void> => {
  Bot.on(
    "interactionCreate",
    async (interaction) => await onInteractionCreate(Bot, interaction)
  );

  Bot.on("ready", async () => await onReady(Bot));
};
