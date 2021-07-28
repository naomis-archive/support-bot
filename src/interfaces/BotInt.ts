import { Client, WebhookClient } from "discord.js";
export interface BotInt extends Client {
  discordToken: string;
  whId: `${bigint}`;
  whToken: string;
  logHook: WebhookClient;
}
