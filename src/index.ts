import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import Spinnies from "spinnies";
import { Client, WebhookClient } from "discord.js";
import { IntentOptions } from "./config/IntentOptions";
import { validateEnv } from "./modules/validateEnv";
import { BotInt } from "./interfaces/BotInt";
import { handleEvents } from "./modules/handleEvents";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

const initialiseBot = async () => {
  const spinner = new Spinnies();
  const Bot = new Client({ intents: IntentOptions }) as BotInt;

  spinner.add("get-env", {
    text: "Validating ENV values",
    color: "cyan",
  });

  const validEnv = await validateEnv(Bot);
  if (!validEnv) {
    spinner.fail("get-env", {
      text: "Invalid ENV values",
      color: "red",
    });
    return;
  }
  spinner.succeed("get-env", {
    text: "ENV values are valid!",
    color: "green",
  });

  Bot.logHook = new WebhookClient(Bot.whId, Bot.whToken);

  await handleEvents(Bot);

  await Bot.login(Bot.discordToken);
};

initialiseBot();
