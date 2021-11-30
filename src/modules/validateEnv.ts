import { BotInt } from "../interfaces/BotInt";

/**
 * Validates that all environment variables are present.
 *
 * @param {BotInt} Bot The bot instance.
 * @returns {boolean} True if the variables are all present, false if any are missing.
 */
export const validateEnv = (Bot: BotInt): boolean => {
  const token = process.env.DISCORD_TOKEN;
  const whUrl = process.env.WH_URL;
  const botHome = process.env.GUILD_ID;
  const botOwner = process.env.OWNER_ID;
  const category = process.env.TICKET_CATEGORY;
  const supportRole = process.env.SUPPORT_ROLE;

  if (!token || !whUrl || !botHome || !botOwner || !category || !supportRole) {
    return false;
  }

  Bot.discordToken = token;
  Bot.whUrl = whUrl;
  Bot.botHome = botHome;
  Bot.botOwner = botOwner;
  Bot.category = category;
  Bot.supportRole = supportRole;
  Bot.ticketLogs = {};

  return true;
};
