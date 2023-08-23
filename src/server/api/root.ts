import { createTRPCRouter } from "~/server/api/trpc";
import { newsLetterRouter } from "./routers/newsletter";
import { adminRouter } from "./routers/admin";
import { categoryRouter } from "./routers/category";
import { productRouter } from "./routers/product";
import { logsRouter } from "./routers/logs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  newsletter: newsLetterRouter,
  admin: adminRouter,
  category: categoryRouter,
  product: productRouter,
  logs: logsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
