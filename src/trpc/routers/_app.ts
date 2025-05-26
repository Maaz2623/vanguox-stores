import { createTRPCRouter } from "../init";
import { productsRouter } from "../procedures/products.procedure";
import { storesRouter } from "../procedures/stores.procedure";
export const appRouter = createTRPCRouter({
  stores: storesRouter,
  products: productsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
