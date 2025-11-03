import request from 'supertest';
import express from 'express';
import productsRouter from '../src/routes/products';
import cartRouter from '../src/routes/cart';

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

describe('API Routes Tests', () => {
  // 1. Test obtener lista de productos
  test('GET /api/products debería retornar lista de productos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // 2. Test obtener un producto específico
  test('GET /api/products/1 debería retornar un producto', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  // 3. Test producto no existente
  test('GET /api/products/999 debería retornar 404', async () => {
    const res = await request(app).get('/api/products/999');
    expect(res.status).toBe(404);
  });

  // 4. Test agregar al carrito
  test('POST /api/cart/add debería agregar item al carrito', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .send({ productId: 1, qty: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  // 5. Test validación de cantidad en carrito
  test('POST /api/cart/add debería validar cantidad', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .send({ productId: 1, qty: -1 });
    expect(res.status).toBe(400);
  });

  // 6. Test obtener carrito
  test('GET /api/cart debería retornar el carrito', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // 7. Test remover del carrito
  test('POST /api/cart/remove debería remover item', async () => {
    const res = await request(app)
      .post('/api/cart/remove')
      .send({ productId: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });

  // 8. Test limpiar carrito
  test('POST /api/cart/clear debería vaciar el carrito', async () => {
    const res = await request(app).post('/api/cart/clear');
    expect(res.status).toBe(200);
    expect(res.body.cart).toHaveLength(0);
  });

  // 9. Test validación de producto existente
  test('POST /api/cart/add debería validar existencia del producto', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .send({ productId: 999, qty: 1 });
    expect(res.status).toBe(400);
  });

  // 10. Test cálculo del total del carrito
  test('GET /api/cart/total debería calcular el total', async () => {
    await request(app)
      .post('/api/cart/add')
      .send({ productId: 1, qty: 2 });
    const res = await request(app).get('/api/cart/total');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('currency', 'COP');
  });
});