import * as Sentry from "@sentry/node";

import { logHandler } from "./logHandler";

/**
 * Standard error handling module to pipe errors to Sentry and
 * format the error for logging.
 *
 * @param {string} context A description of where the error occurred.
 * @param {any} error The error object.
 */
export const errorHandler = (context: string, error: unknown): void => {
  const parsed = error as Error;
  logHandler.log("error", `There was an error in the ${context}:`);
  logHandler.log(
    "error",
    JSON.stringify({ errorMessage: parsed.message, errorStack: parsed.stack })
  );
  Sentry.captureException(error);
};
