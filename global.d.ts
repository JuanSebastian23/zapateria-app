import type { CartItem } from "./src/types/index.d";
import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      session?: {
        cart?: CartItem[];
      };
    }
  }
}
export {};
