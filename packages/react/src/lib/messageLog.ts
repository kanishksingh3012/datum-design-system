import { createContext } from "react";

/** True inside a MessageScroller, whose role="log" already announces new messages. */
export const MessageLogContext = createContext(false);
