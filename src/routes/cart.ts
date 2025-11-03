import { Router } from "express";
import type { CartItem } from "../types/index.d.js";
import { products } from "./products.js";

const router = Router();

// Cart is stored per-session in cookie-session
router.get("/", (req, res) => {
  const cart: CartItem[] = (req.session as any).cart || [];
  res.json(cart);
});

router.post("/add", (req, res) => {
  const { productId, qty } = req.body as CartItem;
  if (!productId || qty == null || qty <= 0) {
    return res.status(400).json({ error: "Datos inválidos" });
  }
  const sess: any = req.session;
  sess.cart = sess.cart || [];
  const idx = sess.cart.findIndex((i: CartItem) => i.productId === productId);
  if (idx >= 0) sess.cart[idx].qty += qty;
  else sess.cart.push({ productId, qty });
  res.json({ ok: true, cart: sess.cart });
});

router.post("/remove", (req, res) => {
  const { productId } = req.body as { productId: number };
  if (!productId) return res.status(400).json({ error: "productId requerido" });
  const sess: any = req.session;
  sess.cart = (sess.cart || []).filter((i: CartItem) => i.productId !== productId);
  res.json({ ok: true, cart: sess.cart });
});

router.post("/clear", (req, res) => {
  (req.session as any).cart = [];
  res.json({ ok: true, cart: [] });
});

router.get("/total", (req, res) => {
  const cart: CartItem[] = (req.session as any).cart || [];
  const productMap = new Map(products.map(p => [p.id, p]));
  const total = cart.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  res.json({ total, currency: "COP" });
});

export default router;
