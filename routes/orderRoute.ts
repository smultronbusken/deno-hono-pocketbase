import { Hono } from '@hono/hono';
import OrderService from '../services/orderService.ts';
import { Env } from '../types.ts';

function orderRoute(): Hono<Env> {
  const app = new Hono<Env>();

  app.get('/', async (c) => {
    const orderService = new OrderService(c);
    const res = await orderService.list();
    return c.json(res);
  });

  app.get('/:id', async (c) => {
    const orderService = new OrderService(c);
    const res = await orderService.getById(c.req.param('id'));
    return c.json(res);
  });

  app.post('/', async (c) => {
    const orderService = new OrderService(c);
    const data = await c.req.json();

    // Validate required fields
    if (!data.customerId || !data.items || !Array.isArray(data.items)) {
      return c.json({ error: 'Customer ID and items are required.' }, 400);
    }

    try {
      const res = await orderService.create(data);
      return c.json(res, 201);
    } catch (error) {
      console.error('Error creating order:', error);
      return c.json({ error: 'Failed to create order.' }, 500);
    }
  });

  // Similar PUT and DELETE endpoints...

  return app;
}

export default orderRoute;