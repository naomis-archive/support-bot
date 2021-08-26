import { BotInt } from "../interfaces/BotInt";

export const validateEnv = async (Bot: BotInt): Promise<boolean> => {
  const token = process.env.DISCORD_TOKEN;
  const whUrl = process.env.WH_URL;
  const botHome = process.env.GUILD_ID;
  const botOwner = process.env.OWNER_ID;

  if (!token || !whUrl || !botHome || !botOwner) {
    return false;
  }

  Bot.discordToken = token;
  Bot.whUrl = whUrl;
  Bot.botHome = botHome;
  Bot.botOwner = botOwner;

  return true;
};
