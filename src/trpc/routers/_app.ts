import { createTRPCRouter } from "../init";
import { storesRouter } from "../procedures/stores.procedure";
export const appRouter = createTRPCRouter({
  stores: storesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
