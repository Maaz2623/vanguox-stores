import { createTRPCRouter } from "../init";
import { productImagesRouter } from "../procedures/product-images.procedure";
import { productsRouter } from "../procedures/products.procedure";
import { storesRouter } from "../procedures/stores.procedure";


export const appRouter = createTRPCRouter({
  stores: storesRouter,
  products: productsRouter,
  productImages: productImagesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
