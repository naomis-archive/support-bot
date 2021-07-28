import { CommandInt } from "../interfaces/CommandInt";
import { claim } from "./tickets/claim";
import { close } from "./tickets/close";
import { ticket } from "./tickets/ticket";

export const CommandList: CommandInt[] = [ticket, claim, close];
