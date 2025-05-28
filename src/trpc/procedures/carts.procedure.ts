import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { cartItems, carts, stores } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const cartsRouter = createTRPCRouter({
  addToCart: baseProcedure
    .input(
      z.object({
        storeName: z.string(),
        productId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));

      const [existingCart] = await db
        .select()
        .from(carts)
        .where(
          and(
            eq(carts.storeId, store.id),
            eq(carts.isActive, true),
            eq(carts.userId, "maaz")
          )
        );

      if (!existingCart) {
        const [newCart] = await db
          .insert(carts)
          .values({
            storeId: store.id,
          })
          .returning();

        const [newCartItem] = await db
          .insert(cartItems)
          .values({
            cartId: newCart.id,
            productId: input.productId,
          })
          .returning();

        return newCartItem;
      }

      const [newCartItem] = await db
        .insert(cartItems)
        .values({
          cartId: existingCart.id,
          productId: input.productId,
        })
        .returning();

      return newCartItem;
    }),
});
