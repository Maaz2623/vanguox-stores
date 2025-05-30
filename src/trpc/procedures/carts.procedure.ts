import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { cartItems, carts, products, stores } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const cartsRouter = createTRPCRouter({
  getCartByStoreName: baseProcedure
    .input(
      z.object({
        storeName: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));

      const [cart] = await db
        .select()
        .from(carts)
        .where(and(eq(carts.storeId, store.id), eq(carts.isActive, true)));

      if (!cart) {
        const [newCart] = await db
          .insert(carts)
          .values({
            storeId: store.id,
          })
          .returning();

        return newCart;
      }

      return cart;
    }),

  getCartItemsByCartId: baseProcedure
    .input(
      z.object({
        cartId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const items = await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          productId: cartItems.productId,
          cartId: cartItems.cartId,
          addedAt: cartItems.addedAt,
          product: {
            id: products.id,
            title: products.title,
            price: products.price,
          },
        })
        .from(cartItems)
        .where(eq(cartItems.cartId, input.cartId))
        .innerJoin(products, eq(cartItems.productId, products.id))
        .orderBy(desc(cartItems.addedAt));

      return items;
    }),
  decrementFromCart: baseProcedure
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
        throw new TRPCError({ code: "NOT_FOUND", message: "Cart not found" });
      }

      const [item] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, existingCart.id),
            eq(cartItems.productId, input.productId)
          )
        );

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Item not found" });
      }

      if (item.quantity > 1) {
        const [updatedItem] = await db
          .update(cartItems)
          .set({
            quantity: sql`${cartItems.quantity} - 1`,
          })
          .where(eq(cartItems.id, item.id))
          .returning();

        return updatedItem;
      } else {
        await db.delete(cartItems).where(eq(cartItems.id, item.id));

        return {
          deleted: true,
          productId: item.productId,
          cartId: existingCart.id,
        };
      }
    }),
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

      let [existingCart] = await db
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
        [existingCart] = await db
          .insert(carts)
          .values({
            storeId: store.id,
            userId: "maaz", // add userId here if required
            isActive: true,
          })
          .returning();
      }

      const [itemExists] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, existingCart.id),
            eq(cartItems.productId, input.productId)
          )
        );

      if (itemExists) {
        const [updatedItem] = await db
          .update(cartItems)
          .set({
            quantity: sql`${cartItems.quantity} + 1`,
          })
          .where(
            and(
              eq(cartItems.cartId, existingCart.id),
              eq(cartItems.productId, input.productId)
            )
          )
          .returning();

        return updatedItem;
      }

      const [newCartItem] = await db
        .insert(cartItems)
        .values({
          cartId: existingCart.id,
          productId: input.productId,
          quantity: 1,
        })
        .returning();

      return newCartItem;
    }),
});
