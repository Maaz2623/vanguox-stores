import { createTRPCRouter } from "../init";
import { cartsRouter } from "../procedures/carts.procedure";
import { productImagesRouter } from "../procedures/product-images.procedure";
import { productsRouter } from "../procedures/products.procedure";
import { storesRouter } from "../procedures/stores.procedure";


export const appRouter = createTRPCRouter({
  stores: storesRouter,
  products: productsRouter,
  productImages: productImagesRouter,
  carts: cartsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
