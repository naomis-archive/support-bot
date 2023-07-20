import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { BotInt } from "./BotInt";

export interface CommandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandBuilder;
  run: (Bot: BotInt, interaction: ChatInputCommandInteraction) => Promise<void>;
}
