import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";

import { CommandList } from "../commands/CommandList";
import { BotInt } from "../interfaces/BotInt";
import { logHandler } from "../utils/logHandler";

/**
 * Handles the READY event, loads the slash commands to the
 * home guild.
 *
 * @param {BotInt} Bot The bot instance.
 */
export const onReady = async (Bot: BotInt): Promise<void> => {
  logHandler.log("debug", "Bot is connected to Discord!");

  const rest = new REST({ version: "9" }).setToken(Bot.discordToken);
  const commandData: {
    name: string;
    description?: string;
    options?: APIApplicationCommandOption[];
  }[] = [];

  CommandList.forEach((command) => commandData.push(command.data.toJSON()));
  await rest.put(
    Routes.applicationGuildCommands(
      Bot.user?.id || "missing token",
      process.env.GUILD_ID as string
    ),
    { body: commandData }
  );

  logHandler.log("debug", "registered commands");
};
