import { RewriteFrames } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { Client, WebhookClient } from "discord.js";

import { IntentOptions } from "./config/IntentOptions";
import { BotInt } from "./interfaces/BotInt";
import { handleEvents } from "./modules/handleEvents";
import { validateEnv } from "./modules/validateEnv";
import { logHandler } from "./utils/logHandler";

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
  const Bot = new Client({ intents: IntentOptions }) as BotInt;

  const validEnv = await validateEnv(Bot);

  if (!validEnv) {
    logHandler.log("error", "Missing environment variables.");
    return;
  }

  logHandler.log("debug", "Environment variables valid!");

  Bot.logHook = new WebhookClient({ url: Bot.whUrl });

  await handleEvents(Bot);
  logHandler.log("debug", "Event listeners loaded.");

  await Bot.login(Bot.discordToken);
};

initialiseBot();
