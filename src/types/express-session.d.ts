import "express-session";
import type { CartItem } from "../types/index.d.js";

declare module "express-session" {
  interface SessionData {
    cart?: CartItem[];
  }
}
