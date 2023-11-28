import { createContext } from "react";
import type { userContext } from "./types";

export const UserContext = createContext<userContext>({ } as userContext);