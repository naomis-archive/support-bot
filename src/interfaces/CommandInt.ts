import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { BotInt } from "./BotInt";

export interface CommandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandBuilder;
  run: (Bot: BotInt, interaction: CommandInteraction) => Promise<void>;
}
