import { Client, WebhookClient } from "discord.js";

export interface BotInt extends Client {
  discordToken: string;
  whUrl: string;
  logHook: WebhookClient;
  botHome: string;
  botOwner: string;
  supportRole: string;
  ticketLogs: { [key: string]: string };
}
