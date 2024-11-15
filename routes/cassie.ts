import { Hono } from '@hono/hono';
import CassieService from "../services/cassie_service.ts";
import { Env } from "../types.ts";

function cassieRoute(): Hono<Env> {
    const app = new Hono<Env>()

    app.get('/', async (c) => {
        const cassieService = new CassieService(c)
        const res = await cassieService.list()
        return c.json(res)
    }).post('/', async (c) => {
        const cassieService = new CassieService(c);

        const data = await c.req.json();
        if (!data.name) {
            return c.json({ error: 'Name field is required.' }, 400);
        }

        try {
            const res = await cassieService.create(data);
            return c.json(res, 201);
        } catch (error) {
            console.error('Error creating record:', error);
            return c.json({ error: 'Failed to create record.' }, 500);
        }
    }).delete('/', async (c) => {
        const cassieService = new CassieService(c);

        const data = await c.req.json();
        if (!data.id) {
            return c.json({ error: 'Id field is required.' }, 400);
        }

        try {
            const res = await cassieService.delete(data.id);
            return c.json(res);
        } catch (error) {
            console.error('Error creating record:', error);
            return c.json({ error: 'Failed to create record.' }, 500);
        }

    })

    return app;
}

export default cassieRoute