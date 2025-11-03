import { Router } from "express";
import { Request, Response } from "express";
import { products } from "./products.js";
import "cookie-session";
import type { CartItem } from "../types/index.d.js";

const router = Router();

// Cart is stored per-session in cookie-session
router.get("/", (req: Request, res: Response) => {
  const cart: CartItem[] = (req.session as any).cart || [];
  res.json(cart);
});

router.post("/add", (req: Request, res: Response) => {
  const { productId, qty } = req.body as CartItem;
  // Validar cantidad
  if (!productId || qty == null || qty <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a cero y productId es requerido." });
  }
  // Validar existencia del producto
  const productExists = products.some((p: any) => p.id === productId);
  if (!productExists) {
    return res.status(400).json({ error: "El producto no existe." });
  }
  const sess: any = req.session;
  sess.cart = sess.cart || [];
  const idx = sess.cart.findIndex((i: CartItem) => i.productId === productId);
  if (idx >= 0) sess.cart[idx].qty += qty;
  else sess.cart.push({ productId, qty });
  res.json({ ok: true, cart: sess.cart });
});

router.post("/remove", (req: Request, res: Response) => {
  const { productId } = req.body as { productId: number };
  if (!productId) {
    return res.status(400).json({ error: "productId requerido" });
  }
  // Validar existencia del producto
  const productExists = products.some((p: any) => p.id === productId);
  if (!productExists) {
    return res.status(400).json({ error: "El producto no existe." });
  }
  const sess: any = req.session;
  sess.cart = (sess.cart || []).filter((i: CartItem) => i.productId !== productId);
  res.json({ ok: true, cart: sess.cart });
});

router.post("/clear", (req: Request, res: Response) => {
  (req.session as any).cart = [];
  res.json({ ok: true, cart: [] });
});

router.get("/total", (req: Request, res: Response) => {
  const cart: CartItem[] = (req.session as any).cart || [];
  const productMap = new Map(products.map(p => [p.id, p]));
  const total = cart.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  res.json({ total, currency: "COP" });
});

export default router;
