import { ButtonInteraction } from "discord.js";
import { BotInt } from "./BotInt";

export type ButtonHandler = (
  Bot: BotInt,
  interaction: ButtonInteraction
) => Promise<void>;
