import "cookie-session";
import type { CartItem } from "../types/index.d";

declare module "cookie-session" {
  interface CookieSessionInterfaces {
    cart?: CartItem[];
  }
}
