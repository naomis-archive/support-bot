import { onMessageCreate } from "../events/onMessageCreate";
import { onReady } from "../events/onReady";
import { BotInt } from "../interfaces/BotInt";

export const handleEvents = async (Bot: BotInt): Promise<void> => {
  Bot.on(
    "messageCreate",
    async (message) => await onMessageCreate(Bot, message)
  );

  Bot.on("ready", async () => await onReady());
};
