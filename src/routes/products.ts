import { Router } from "express";
import type { Product } from "../types/index.d.js";

const router = Router();

const products: Product[] = [
  { id: 1, name: "Polo Unicolor Clásico", price: 89900, image: "/img/polo_unicolor.webp", description: "Polo básico unicolor, 100% algodón pima, perfecto para el día a día.", stock: 35 },
  { id: 2, name: "Polo Pique Deportivo", price: 129900, image: "/img/polo_pique.webp", description: "Polo tipo piqué, diseño deportivo con tecnología de secado rápido.", stock: 28 },
  { id: 3, name: "Polo Premium Oxford", price: 159900, image: "/img/polo_premium.webp", description: "Polo premium con acabado oxford, ideal para ocasiones especiales.", stock: 15 },
  { id: 4, name: "Runner Azul", price: 199999, image: "/img/shoe_1.png", description: "Zapatilla ligera para correr, malla transpirable.", stock: 12 },
  { id: 5, name: "Classic Rojo", price: 149999, image: "/img/shoe_2.png", description: "Clásico urbano para uso diario.", stock: 24 },
  { id: 6, name: "Eco Verde", price: 179999, image: "/img/shoe_3.png", description: "Materiales reciclados, cómodo y resistente.", stock: 8 },
  { id: 7, name: "Urban Naranja", price: 159999, image: "/img/shoe_4.png", description: "Estilo urbano con suela de alta tracción.", stock: 16 },
  { id: 8, name: "Sport Morado", price: 189999, image: "/img/shoe_5.png", description: "Para entrenamientos de alto rendimiento.", stock: 10 },
  { id: 9, name: "Trail Gris", price: 209999, image: "/img/shoe_6.png", description: "Ideal para montaña y terrenos irregulares.", stock: 7 },
];

router.get("/", (_req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

export { products };
export default router;
