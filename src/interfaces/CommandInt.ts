import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import { BotInt } from "./BotInt";

export interface CommandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandBuilder;
  run: (Bot: BotInt, interaction: ChatInputCommandInteraction) => Promise<void>;
}
