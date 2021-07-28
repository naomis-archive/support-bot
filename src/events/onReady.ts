import { logHandler } from "../utils/logHandler";

export const onReady = async (): Promise<void> => {
  logHandler.log("debug", "Bot is connected to Discord!");
};
