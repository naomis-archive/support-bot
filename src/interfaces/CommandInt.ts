import { Message } from "discord.js";
import { BotInt } from "./BotInt";

export interface CommandInt {
  name: string;
  run: (Bot: BotInt, message: Message) => Promise<void>;
}
