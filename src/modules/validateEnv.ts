import { BotInt } from "../interfaces/BotInt";

export const validateEnv = async (Bot: BotInt): Promise<boolean> => {
  const token = process.env.DISCORD_TOKEN;
  const whId = process.env.WH_ID;
  const whToken = process.env.WH_TOKEN;

  if (!token || !whId || !whToken) {
    return false;
  }

  Bot.discordToken = token;
  Bot.whId = `${BigInt(whId)}`;
  Bot.whToken = whToken;

  return true;
};
