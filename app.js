import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from "./middlewares/middleware.js";
import { Session } from "https://deno.land/x/session@v1.0.0/mod.ts";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
const app = new Application();

app.use(middleware.errorMiddleware);

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine));

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

app.use(router.routes());

if (!Deno.env.get("TEST_ENVIRONMENT")) {
  app.listen({ port: 7777 });
}

export default app;
